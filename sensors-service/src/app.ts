import express from "express";
import sensorRoutes from './routes/sensorRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import monitoringRoutes from './routes/monitoringRoutes';
import notificationRoutes from './routes/notificationRoutes';
import mongoose from "mongoose";
import rankingRoutes from "./routes/rankingRoutes";


const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/sensor_db';

mongoose.connect(MONGO_URL, {})
  .then(async () => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const app = express();

app.use(express.json());

app.use('/api', sensorRoutes);
app.use('/api', assignmentRoutes);
app.use('/api', monitoringRoutes);
app.use('/api', notificationRoutes);
app.use('/api', rankingRoutes);
  

const port = process.env.PORT || 3005;
  app.listen(port, () => {
    console.log(`Sensor service running on port ${port}`);
});