
import { Router } from 'express';
import { Sensor } from '../models/sensor';


const router = Router();


router.get('/monitoring', async (req, res) => {
  try {
    const sensors = await Sensor.find().select('signals');
    const signals = sensors.flatMap(sensor => sensor.signals);
    res.status(200).json(signals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sensor data' });
  }
});

router.get('/monitoring/:sensorId', async (req, res) => {
  try {
    const { sensorId } = req.params;
    const sensor = await Sensor.findOne({ id: sensorId }).select('signals');
    if (!sensor) {
      return res.status(404).json({ error: 'No data found for the given sensor ID' });
    }
    res.status(200).json(sensor.signals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sensor data' });
  }
});


export default router;