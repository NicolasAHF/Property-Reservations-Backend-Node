import express from 'express';
import reservationRoutes from './routes/reservationRoutes';
import dotenv from 'dotenv';
import countryConfigRoutes from './routes/countryConfigRoutes';
import errorHandler from './utils/errorHandler';

dotenv.config();

const app = express();
app.use(express.json());


app.use(errorHandler);

app.use('/api', reservationRoutes);
app.use('/api', countryConfigRoutes);



export default app;
