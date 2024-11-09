import express from 'express';
import dotenv from 'dotenv';
import { makePayment , addFunds, getAccounts } from './services/paymentService';
import { dbSync } from './config/database';
import { loadData } from './config/loadData';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/payments', makePayment);
app.post('/funds', addFunds);
app.get('/accounts', getAccounts)


const PORT = process.env.PORT || 3010;

const startServer = async () => {
    try {
      await dbSync();
      await loadData();
      app.listen(PORT, (): void => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error: any) {
      console.error(`Error occured: ${error.message}`);
    }
  };
  
startServer();