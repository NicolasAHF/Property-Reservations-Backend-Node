import e, { Request, Response } from 'express';
import Reservation from '../models/Reservation';
import CountryConfig from '../models/CountryConfig';
import { Op } from 'sequelize';
import { publishToQueue } from './publishService';
import errorHandler from '../utils/errorHandler';
import axios from 'axios';
import { getNotificationsFromQueue } from './subscriberService';
import logger from '../utils/logger';
import { makePayment, makeRefund } from './paymentService';
import { ValidateReservationDataFilter } from '../filters/validateReservationData';
import { Pipe } from '../Pipeline/Pipeline';
import { CheckPropertyAvailabilityFilter } from '../filters/checkPropertyAvailability';
import { CheckOccupancyLimitFilter } from '../filters/checkOccupancyLimit';
import { FindOrCreateTenantFilter } from '../filters/findOrCreateTenant';
import { ValidateAgendaFilter } from '../filters/validateAgendaFilter';


export const createReservation = async (req: Request, res: Response) => {
  const newReservation = req.body

  const pipeline = new Pipe([
    new ValidateReservationDataFilter(),
    new FindOrCreateTenantFilter(),
    new CheckPropertyAvailabilityFilter(),
    new ValidateAgendaFilter(),
    new CheckOccupancyLimitFilter(),
  ]);

  const { propertyId, email, startDate, endDate, adults, children, price } = req.body;

  logger.info('Creating reservation for propertyId: %s, email: %s, startDate: %s, endDate: %s', propertyId, email, startDate, endDate);

  try {

    await pipeline.process(newReservation);
    
    const reservation = await Reservation.create({
      propertyId,
      email,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdAt: new Date(),
      adults,
      children,
      price
    });

    await publishToQueue('reservation_created', reservation);

    logger.info('Reservation created successfully for email: %s', email);

    res.status(201).json(reservation);
  } catch (error: any) {
    logger.error('Error creating reservation for email: %s, error: %s', email, error.message);
    errorHandler(error, req, res);
  }
};

export const approveReservation = async (req: Request, res: Response) => {
    const { id } = req.params;

    logger.info('Approving reservation with id: %s', id);
  
    try {

      const reservation = await Reservation.findByPk(id);
      if (!reservation) {
        logger.warn('Reservation not found with id: %s', id);
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      reservation.set('status', 'confirmada');

      await reservation.save();

      logger.info('Reservation approved successfully with id: %s', id);

  
      res.status(200).json({ message: 'Reservation approved successfully' });
    } catch (error: any) {
      logger.error('Error approving reservation with id: %s, error: %s', id, error.message);
      errorHandler(error, req, res);
    }
  };

  export const cancelReservation = async (req: Request, res: Response) => {
    const { email, reservationCode } = req.body;

    logger.info('Cancelling reservation with reservationCode: %s, email: %s', reservationCode, email);
  
    try {

      const user = (await axios.get(`${process.env.USERS_SERVICE_URL}/users`, {
        params: { email: email }
      })).data;

      const reservation = await Reservation.findOne({
        where: {
          id: reservationCode,
          status: { [Op.ne]: 'cancela inquilino' }
        }
      });

      const userId = reservation?.get('userId') as number

      if (!user) {
        logger.warn('Tenant not found with email: %s', email);
        return res.status(400).json({ message: 'Tenant not found' });
      }
      
      if(user?.id !== userId){
        logger.warn('Reservation is not for that tenant: email: %s, reservationCode: %s', email, reservationCode);
        return res.status(404).json({ message: 'Reservation is not for that tenant' });
      }
  
      if (!reservation) {
        logger.warn('Reservation not found or already cancelled: reservationCode: %s', reservationCode);
        return res.status(404).json({ message: 'Reservation not found or already cancelled' });
      }
  
      const countryConfig = await CountryConfig.findOne({ where: { country: user.country } });
  
      if (!countryConfig) {
        logger.warn('Country configuration not found for country: %s', user.country);
        return res.status(400).json({ message: 'Country configuration not found' });
      }

      const reservationStartDate = reservation.get('startDate') as Date
      const currentDate = new Date();
      const startDate = new Date(reservationStartDate);
      const diffDays = Math.ceil((startDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      const daysNotice = (countryConfig.get('daysNotice') as number)
  
      if (diffDays < daysNotice) {
        logger.warn('Cannot cancel reservation. Must be cancelled at least %d days in advance: reservationCode: %s, email: %s', daysNotice, reservationCode, email);
        return res.status(400).json({ message: `Cannot cancel reservation. Must be cancelled at least ${daysNotice} days in advance` });
      }
  
      const bankAccount = user.bankAccountId as number;
      const refundPercentage = countryConfig.get('refundPercentage') as number / 100;
      const refundAmount = refundPercentage * (reservation.get('price') as number);
      const wasRefundSuccessful : boolean = await makeRefund(bankAccount,refundAmount);
      if (!wasRefundSuccessful) {
        logger.warn('Error refunding payment for reservation with reservationCode: %s, email: %s', reservationCode, email);
        return res.status(400).json({ message: 'Error refunding payment' });
      }
      logger.info('Payment refunded successfully for reservation with reservationCode: %s, email: %s', reservationCode, email);

      reservation.set('status', 'cancela inquilino');
      await reservation.save();
      logger.info('Reservation cancelled successfully with reservationCode: %s, email: %s', reservationCode, email);

      res.status(200).json({ message: 'Reservation cancelled successfully', refundPercentage: countryConfig.get('refundPercentage') });
    } catch (error: any) {
      logger.error('Error cancelling reservation with reservationCode: %s, email: %s, error: %s', reservationCode, email, error.message);
      errorHandler(error, req, res);
    }
};

export const getUserNotifications = async (req: Request, res: Response) => { 
  try {
    const notifications = await getNotificationsFromQueue();
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving notifications' });
  }
};

export const payReservation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cardNum, cvv, expMonth, expYear } = req.body;

  logger.info('Paying reservation with id: %s', id);

  try {

    const  reservation = await Reservation.findByPk(id);
    if (!reservation) {
      logger.warn('Reservation not found with id: %s', id);
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    const reservationPrice : number = reservation.get("price") as number;

    const paymentResult = await makePayment({ amount: reservationPrice , cardNum, cvv, expMonth, expYear });

    if (!paymentResult) {
      logger.warn('Declined payment for reservation with id: %s', id);
      return res.status(400).json({ message: 'The payment was declined' });
    }
  
    reservation.set('status', 'paga');
    await reservation.save();

    logger.info('Reservation paid successfully with id: %s', id);

    await publishToQueue('reservation_paid', reservation);

    res.status(200).json({ message: 'Reservation paid successfully' });
  } catch (error: any) {
    logger.error('Error paying reservation with id: %s, error: %s', id, error.message);
    errorHandler(error, req, res);
  }
};

export const checkAndCancelUnpaidReservations = async () => {
  try{
  logger.info('Checking and cancelling unpaid reservations');

  const reservationTimeout : string = process.env.RESERVATION_TIMEOUT_SECONDS as string;
  
  const currentDate = new Date();
  const timeoutDate = new Date(currentDate.getTime() - parseInt(reservationTimeout) * 1000);

  const reservations = await Reservation.findAll({
    where: {
      status: { [Op.or]: [{ [Op.eq]: 'pendiente' }, { [Op.eq]: 'confirmada' }] },
      createdAt: { [Op.lte]: timeoutDate }
    }
  });

  for (const reservation of reservations) {
    const reservationId = reservation.get('id') as number;
    const email = reservation.get('email') as string;
    logger.info('Cancelling unpaid reservation with id: %s, email: %s', reservationId, email);

    reservation.set('status', 'cancelada por falta de pago');
    await reservation.save();

    logger.info('Unpaid reservation cancelled with id: %s, email: %s', reservationId, email);
  }

  logger.info('Unpaid reservations checked and cancelled successfully');
  } catch (error: any) {
    logger.error('Error checking and cancelling unpaid reservations: %s', error.message);
  }
}