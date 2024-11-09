import { Router } from 'express';
import { Request, Response} from 'express';
import { logger } from '../index';
import axios from 'axios';
import { authorize } from '../middlewares/authorize';

const router = Router();
const SENSOR_SERVICE_URL= process.env.SENSOR_SERVICE_URL;

router.post('/sensors', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${SENSOR_SERVICE_URL}/api/sensors`, req.body);
        logger.info('Adding sensor succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Adding sensor failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.post('/signals',async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${SENSOR_SERVICE_URL}/api/signals`, req.body);
        logger.info('Sending signal succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Sending signal failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.post('/sensors/notification-config', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${SENSOR_SERVICE_URL}/api/notification-config`, req.body);
        logger.info('Adding notification config succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Adding notification config failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.post('/sensors/assignments', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${SENSOR_SERVICE_URL}/api/assignments`, req.body);
        logger.info('Assigning sensor to property succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Assigning sensor to property failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/sensors/assignments', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/assignments`);
        logger.info('Getting sensor assignements succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Getting sensor assignements failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/sensors/assignments/:propertyId', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/assignments/${req.params.propertyId}`);
        logger.info('Getting sensor assignement by propertyId succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Getting sensor assignement by propertyId failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/sensors/notification-config/:serviceType', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/notification-config/${req.params.serviceType}`);
        logger.info('Getting notification-config succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Getting notification-config failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/sensors/notifications', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/notifications`);
        logger.info('Getting sensor notificationsucceeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Getting sensor notification failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});


router.get('/sensors', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/sensors`);
        logger.info('Getting sensors succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Getting sensors failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/sensors/:id', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/sensors/${req.params.id}`);
        logger.info('Getting sensor succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Getting sensor failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/sensor/ranking', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/sensor/ranking`, {
          params: req.query
        });
        logger.info('Getting problems ranking succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Getting problems ranking failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.put('/sensors/:id', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.put(`${SENSOR_SERVICE_URL}/api/sensors/${req.params.id}`);
        logger.info('Updating sensor succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Updating sensor failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.delete('/sensors/:id', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.delete(`${SENSOR_SERVICE_URL}/api/sensors/${req.params.id}`);
        logger.info('Deleting sensor succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Deleting sensor failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});



export default router;