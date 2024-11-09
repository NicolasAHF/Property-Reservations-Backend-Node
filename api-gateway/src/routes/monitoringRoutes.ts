import { Router } from 'express';
import { Request, Response} from 'express';
import { logger } from '../index';
import axios from 'axios';
import { authorize } from '../middlewares/authorize';

const router = Router();
const SENSOR_SERVICE_URL= process.env.SENSOR_SERVICE_URL;

router.get('/monitoring', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/monitoring`);
        logger.info('Monitoring sensors succeeded');
      res.json(response.data);
    } catch (error: any) {
      logger.error('Monitoring sensors failed');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

router.get('/monitoring/:sensorId', authorize(['Administrador']),async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${SENSOR_SERVICE_URL}/api/monitoring/${req.params.sensorId}`);
        logger.info(`Monitoring sensor with id: ${req.params.sensorId} succeeded`);
      res.json(response.data);
    } catch (error: any) {
      logger.error(`Monitoring sensor with id: ${req.params.sensorId} failed`);
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
});

export default router;