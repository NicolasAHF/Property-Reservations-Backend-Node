import { Router } from 'express';
import { Request, Response} from 'express';
import { logger } from '..';
import axios from 'axios';
import { authorize } from '../middlewares/authorize';

const router = Router();
const RESERVATIONS_SERVICE_URL = process.env.RESERVATIONS_SERVICE_URL;
const RESERVATIONSQUERY_SERVICE_URL = process.env.RESERVATIONSQUERY_SERVICE_URL;

router.post('/country-configs', authorize(['Administrador']), async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${RESERVATIONS_SERVICE_URL}/api/country-configs`, req.body);
        logger.info('Adding country succeeded');
      res.json(response.data);
    } catch (error) {
        logger.info('Adding country failed, server error');
      res.status(500).json({ message: 'Error while configurating the country code' });
    }
});


router.put('/country-configs', authorize(['Administrador']), async (req: Request, res: Response) => {
    try {
        const response = await axios.put(`${RESERVATIONS_SERVICE_URL}/api/country-configs`, req.body);
        logger.info('Updating country succeeded');
      res.json(response.data);
    } catch (error: any) {
        logger.info('Updating country failed, server error');
      const status = error.response ? error.response.status : 500;
      res.status(status).json({ message: 'Error while configurating the country code' });
    }
});

router.get('/country-configs', authorize(['Administrador']), async (req: Request, res: Response) => {
  try {
      const response = await axios.get(`${RESERVATIONSQUERY_SERVICE_URL}/api/country-configs`, req.body);
      logger.info('Updating country succeeded');
    res.json(response.data);
  } catch (error: any) {
      logger.info('Updating country failed, server error');
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ message: 'Error while configurating the country code' });
  }
});

export default router;