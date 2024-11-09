import app from './app';
import { dbSync } from './config/database';
import dotenv from 'dotenv';

dotenv.config();


const PORT = process.env.PORT || 3003;


const main = async () => {
  await dbSync();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
