import { Router } from 'express';
import { getOccupancyRates, getRentalIncome, getReservationDetails, getReservations  } from '../services/reservationService'

const router = Router();


router.get('/reservations', getReservationDetails);

router.get('/reservations/search', getReservations);

router.get('/reservations/rental-income', getRentalIncome);

router.get('/reservations/occupancy-rates', getOccupancyRates);



export default router;
