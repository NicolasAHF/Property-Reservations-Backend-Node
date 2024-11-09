
import axios from "axios"
import logger from "../utils/logger";

interface PaymentDetails {
    amount: number;
    cvv: string;
    cardNum: string;
    expMonth: string;
    expYear: string;
}

export const makePayment = async (paymentDetails: PaymentDetails): Promise<boolean> => {
    try {
        logger.info('Sending payment details to payment service')
        const response = await axios.post(`${process.env.PAYMENT_SERVICE_URL}/payments`, paymentDetails);
        const wasPaymentSuccessful : boolean = response.status === 200;
        return wasPaymentSuccessful;
    } catch (error: any) {
        return false;
    }
};

export const makeRefund = async (accountId: number, amount: number): Promise<boolean> => {
    try {
        logger.info('Sending refund request to payment service with refund details: %s', { accountId, amount });
        const response = await axios.post(`${process.env.PAYMENT_SERVICE_URL}/funds`, { accountId, amount });
        const wasRefundSuccessful : boolean = response.status === 200;
        return wasRefundSuccessful;
    } catch (error: any) {
        logger.error('Error refunding payment error: %s', error.message);
        return false;
    }
};