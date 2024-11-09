import app from './app';
import {Request, Response} from 'express';
import { dbSync } from './config/database';
import dotenv from 'dotenv';
import logger from './utils/logger';
import startCronJobs from './utils/scheduler';

dotenv.config();


const PORT = process.env.PORT || 3002;


const main = async () => {
  await dbSync();

  app.use((req: Request, res: Response, next) => {
    logger.info(`Request handled by instance (PID): ${process.pid}`);
    next();
  });
 startCronJobs();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}  (PID: ${process.pid})`);
  });
}

main();
