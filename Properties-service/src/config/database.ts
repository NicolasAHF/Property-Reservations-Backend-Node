import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || ("mysql" as any),
        port: process.env.DB_PORT || (3306 as any),
        dialectOptions: {
            connectTimeout: 60000,
        },
    }
);


const dbSync = async () => {
    await sequelize.sync({ alter: true }).then(() => {
      console.log('Database connected successfully.');
    }).catch((error: any) => {
      console.error('Unable to connect to the database:', error);
})};

export { sequelize, dbSync };
