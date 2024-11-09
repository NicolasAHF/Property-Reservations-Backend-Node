import { Router } from 'express';
import { Request, Response} from 'express';
import { logger } from '../index';
import axios from 'axios';
import { authorize } from '../middlewares/authorize';

const router = Router();
const RESERVATIONS_SERVICE_URL = process.env.RESERVATIONS_SERVICE_URL;
const RESERVATIONSQUERY_SERVICE_URL = process.env.RESERVATIONSQUERY_SERVICE_URL;

router.post('/reservations', authorize(['Administrador','Inquilino']),async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${RESERVATIONS_SERVICE_URL}/api/reservations`, req.body);
        logger.info('Adding reservation succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Adding reservation failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.post('/reservations/cancel', authorize(['Administrador','Inquilino']),async (req: Request, res: Response) => {
  try {
      const response = await axios.post(`${RESERVATIONS_SERVICE_URL}/api/reservations/cancel`, req.body);
      logger.info('Cancelation of the reservation succeeded');
    res.json(response.data);
  } catch (error: any) {
      logger.error('Cancelation of the reservation failed');
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

router.post('/reservations/pay/:id', authorize(['Administrador','Inquilino']),async (req: Request, res: Response) => {
  try {
      const response = await axios.post(`${RESERVATIONS_SERVICE_URL}/api/reservations/pay/${req.params.id}`, req.body);
      logger.info('Reservation payment succeeded');
    res.json(response.data);
  } catch (error: any) {
      logger.error('Reservation payment failed');
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

router.patch('/reservations/:id/approve', authorize(['Administrador']),async (req: Request, res: Response) => {
  try {
      const response = await axios.patch(`${RESERVATIONS_SERVICE_URL}/api/reservations/${req.params.id}/approve`);
      logger.info('Reservation approved');
    res.json(response.data);
  } catch (error: any) {
      logger.error('Approvation failed');
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

router.get('/reservations', authorize(['Administrador','Inquilino']), async (req: Request, res: Response) => {
    try {
      const response = await axios.get(`${RESERVATIONSQUERY_SERVICE_URL}/api/reservations`, {
        params: req.query
      });
        logger.info('Displaying reservation succeeded');
      res.status(200).json(response.data);
    } catch (error: any) {
        logger.error('Displaying reservations failed, server error');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/reservations/search', authorize(['Administrador', 'Operario']), async (req, res) => {
    try {
      const reservationsResponse = await axios.get(`${RESERVATIONSQUERY_SERVICE_URL}/api/reservations/search`, {
        params: req.query
      });
        logger.info('Displaying specific reservation succeeded');
      res.status(200).json(reservationsResponse.data);
    } catch (error: any) {
        logger.error('Displaying specific reservations failed, server error');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/notifications/admins', authorize(['Administrador']), async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${RESERVATIONS_SERVICE_URL}/api/notifications/admins`);
      logger.info('Displaying notifications for admins and owner');
    res.status(200).json(response.data);
  } catch (error: any) {
      logger.error('notifications for admins and owner failed');
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

router.get('/reservations/rental-income', authorize(['Administrador', 'Operario']), async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${RESERVATIONSQUERY_SERVICE_URL}/api/reservations/rental-income`, {
      params: req.query
    });
    logger.info('Displaying rental income ranking');
    res.status(200).json(response.data);
  } catch (error: any) {
      logger.error('Displaying rental income ranking failed');
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

router.get('/reservations/occupancy-rates', authorize(['Administrador', 'Operario']), async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${RESERVATIONSQUERY_SERVICE_URL}/api/reservations/occupancy-rates`, {
      params: req.query
    });
      logger.info('Displaying rental income ranking');
    res.status(200).json(response.data);
  } catch (error: any) {
      logger.error('Displaying rental income ranking failed');
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

export default router;