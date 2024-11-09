import { Router } from 'express';
import { Request, Response} from 'express';
import { logger } from '../index';
import axios from 'axios';
import { authorize } from '../middlewares/authorize';

const router = Router();
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

router.get('/users', authorize(['Administrador']), async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${USERS_SERVICE_URL}/users`);
        logger.info('retrived users successfully');
      res.json(response.data);
    } catch (error: any) {
      logger.info('users retrieve failed, server error');
      const status = error.response ? error.response.status : 500;
      const message = error.response?.data?.message || error.message;
      res.status(status).json({ message: message });
    }
  });

export default router;