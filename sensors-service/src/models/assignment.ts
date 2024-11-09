import mongoose from "mongoose";


const assignmentSchema = new mongoose.Schema({
    propertyId: { type: String, required: true },
    sensorId: { type: String, required: true }
});

export const Assignment  = mongoose.model('Assignment', assignmentSchema);