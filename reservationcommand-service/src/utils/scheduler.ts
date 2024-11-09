import cron from 'node-cron';
import { checkAndCancelUnpaidReservations } from '../services/reservationService';
import logger from './logger'; 

const startCronJobs = () => {
  const schedulerTime = process.env.SCHEDULER_TIME || '*/10 * * * *';
  cron.schedule( schedulerTime, async () => {
    logger.info('Running cron job: Check and cancel unpaid reservations');
    try {
      await checkAndCancelUnpaidReservations();
    } catch (error) {
      logger.error('Failed to run cron job for unpaid reservations:', error);
    }
  });

};

export default startCronJobs;