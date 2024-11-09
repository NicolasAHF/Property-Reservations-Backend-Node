import { Router } from 'express';
import { Sensor } from '../models/sensor';

const router = Router();

router.post('/sensors', async (req, res) => {
    const sensor = new Sensor(req.body);
    try {
      await sensor.save();
      res.status(201).send(sensor);
    } catch (error) {
      res.status(400).send(error);
    }
});

router.get('/sensors', async (req, res) => {
    try {
      const sensors = await Sensor.find();
      res.send(sensors);
    } catch (error) {
      res.status(500).send(error);
    }
});

router.get('/sensors/:id', async (req, res) => {
    try {
      const sensor = await Sensor.findOne({ id: req.params.id });
      if (!sensor) {
        return res.status(404).send();
      }
      res.send(sensor);
    } catch (error) {
      res.status(500).send(error);
    }
});

router.put('/sensors/:id', async (req, res) => {
    try {
      const sensor = await Sensor.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
      if (!sensor) {
        return res.status(404).send();
      }
      res.send(sensor);
    } catch (error) {
      res.status(400).send(error);
    }
});
  
router.delete('/sensors/:id', async (req, res) => {
    try {
      const sensor = await Sensor.findOneAndDelete({ id: req.params.id });
      if (!sensor) {
        return res.status(404).send();
      }
      res.send(sensor);
    } catch (error) {
      res.status(500).send(error);
    }
});



export default router;
