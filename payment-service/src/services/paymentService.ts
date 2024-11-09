import { Request, Response } from 'express';
import { PaymentDetails } from '../interfaces/paymentDetails';
import Card from '../models/Card';
import Account from '../models/Account';
import logger from '../utils/logger';

export const makePayment = async (req: Request, res: Response) => {

    try {
        const { amount, cardNum, cvv, expMonth, expYear }: PaymentDetails = req.body;

        logger.info('Processing payment of %s with card: %s', amount, cardNum);
        if (!amount || !cardNum || !cvv || !expMonth || !expYear) {
            res.status(400).send('Invalid request body');
            return;
        }

        const card = await Card.findOne({ where: { cardNum, cvv, expMonth, expYear } })

        if (!card) {
            res.status(400).send('Invalid card details');
            return;
        }

        const account = await Account.findOne({ where: { id: card.accountId } })

        if (!account) {
            res.status(400).send('Invalid account');
            return;
        }

        if (account.balance < amount) {
            res.status(402).send('Insufficient funds');
            return;
        }

        account.balance -= amount;
        await account.save()
        
        logger.info('%s paid successfully with card: %s', amount, cardNum);
        res.status(200).send('Payment successful');
    } catch (error:any) {
        logger.error('Error processing payment error: %s', error.message);
        res.status(500).send('Error processing payment');
    }
}

export const addFunds = async (req: Request, res: Response) => {

    try {
        const { accountId, amount }: { accountId: number, amount: number } = req.body;

        logger.info('Adding %s funds to account with id: %s', amount, accountId);

        if (!accountId || !amount) {
            res.status(400).send('Invalid request body');
            return;
        }

        const account = await Account.findOne({ where: { id: accountId } })

        if (!account) {
            res.status(400).send('Invalid account');
            return;
        }

        account.balance += amount;
        await account.save()

        logger.info('Funds added successfully to account with id: %s', accountId);

        res.status(200).send('Funds added successfully');
    }
    catch (error:any) {
        logger.error('Error adding funds error: %s', error.message);
        res.status(500).send('Error adding funds');
    }
}

export const getAccounts = async (req: Request, res: Response) => {
        try {
            const accounts = await Account.findAll();
            res.status(200).json(accounts);
        } catch (error) {
            res.status(500).send('Error retrieving accounts');
        }
    }