import { Router } from 'express';
import { approveReservation, cancelReservation, createReservation, payReservation, getUserNotifications } from '../services/reservationService'


const router = Router();

router.post('/reservations',createReservation);

router.post('/reservations/cancel', cancelReservation);

router.patch('/reservations/:id/approve', approveReservation);

router.post('/reservations/pay/:id', payReservation);

router.get('/notifications/admins', getUserNotifications);


export default router;
