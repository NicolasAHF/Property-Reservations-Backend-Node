import { Assignment } from '../models/assignment';

export const getTopProblematicProperties = async (startDate: Date, endDate: Date) => {
    const assignments = await Assignment.aggregate([
        {
            $lookup: {
                from: 'sensors',
                localField: 'sensorId',
                foreignField: 'id',
                as: 'sensor'
            }
        },
        { $unwind: '$sensor' },
        {
            $match: {
                'sensor.problems.timestamp': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $unwind: '$sensor.problems'
        },
        {
            $group: {
                _id: {
                    propertyId: '$propertyId',
                    country: '$country',
                    city: '$city'
                },
                problems: {
                    $push: '$sensor.problems'
                },
                problemCount: { $sum: 1 }
            }
        },
        { $sort: { problemCount: -1 } },
        { $limit: 15 }
    ]);

    const result = assignments.map((assignment: { problems: any[]; _id: { propertyId: any; country: any; city: any; }; problemCount: any; }) => {
        const problemFrequency = assignment.problems.reduce((acc: any, problem: any) => {
            acc[problem.type] = (acc[problem.type] || 0) + 1;
            return acc;
        }, {});

        const sortedProblems = Object.entries(problemFrequency).sort((a: any, b: any) => b[1] - a[1]);

        return {
            propertyId: assignment._id.propertyId,
            country: assignment._id.country,
            city: assignment._id.city,
            totalProblems: assignment.problemCount,
            topProblems: sortedProblems.slice(0, 2)
        };
    });

    return result;
};