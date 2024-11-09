import Card from '../models/Card';
import Account from '../models/Account';

export const loadData = async () => {
    try {
        const account1 = await Account.findOrCreate({
            where: { id: 23456 },
            defaults: { balance: 1000 }
        });

        const account2 = await Account.findOrCreate({
            where: { id: 12345 },
            defaults: { balance: 0 }
        });

        await Card.findOrCreate({
            where: { cardNum: 123456789 },
            defaults: {
                cvv: 123,
                expMonth: 12,
                expYear: 2025,
                accountId: account1[0].id
            }
        });

        await Card.findOrCreate({
            where: { cardNum: 987654321 },
            defaults: {
                cvv: 321,
                expMonth: 11,
                expYear: 2024,
                accountId: account2[0].id
            }
        });
        console.log("Test data loaded successfully");
    } catch (error) {
        console.error("Error loading test data:", error);
    }
};