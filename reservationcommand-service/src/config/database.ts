import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as 'mysql',
    port: process.env.DB_PORT || (3306 as any),
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

const dbSync = async () => {
  await sequelize.sync({ alter: true }).then(() => {
    logger.info('Database connected successfully.');
  }).catch((error) => {
    logger.error('Unable to connect to the database:', error);
  });
};

export { sequelize, dbSync };
