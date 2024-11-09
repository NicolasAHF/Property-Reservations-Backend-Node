import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import usersRoutes from './routes/usersRoutes';
import countryConfigRoutes from './routes/countryConfigRoutes';
import reservationRoutes from './routes/reservationRoutes';
import propertyRoutes from './routes/propertyRoutes';
import sensorRoutes from './routes/sensorRoutes';
import monitoringRoutes from './routes/monitoringRoutes';
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { Client } = require('@elastic/elasticsearch');

const winston = require('winston');

dotenv.config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;


if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    (req as any).user = user;
    next();
  });
};


const esClient = new Client({ node: process.env.ELASTICSEARCH_HOST });

const esTransportOpts = {
  level: 'info',
  client: esClient,
  indexPrefix: 'logstash'
};

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({
        filename: 'registry.log'
    }),
    new ElasticsearchTransport(esTransportOpts),
    new winston.transports.Console()
  ],
});

app.use((req, res, next) => {
  logger.info('HTTP Request', { method: req.method, endpoint: req.url });
  next();
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/users`, {
      params: { email: email }
    });

    const user = response.data;

      if (!user) {
          logger.info('Auth failed for user, no user found');
      return res.status(401).json({ message: 'Authentication failed' });
    }

      if (password !== user.password) {
          logger.info('Auth failed for user, wrong password');
      return res.status(401).json({ message: 'Authentication failed' });
    }

      logger.info('Auth succeeded for user');
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error: any) {
    logger.info('Auth failed for user, server error');
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({ message: message });
  }
});

app.use('/', authenticate, usersRoutes);
app.use('/', authenticate, countryConfigRoutes);
app.use('/', authenticate, reservationRoutes);
app.use('/', authenticate, propertyRoutes);
app.use('/', authenticate, sensorRoutes);
app.use('/', authenticate, monitoringRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
