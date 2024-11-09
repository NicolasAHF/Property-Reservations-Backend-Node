import { Router } from 'express';
import { Notification } from '../models/notification';
import { analyzeSignal } from '../services/notificationService';
import amqp from 'amqplib';
import { Sensor } from '../models/sensor';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

const router = Router();


router.post('/notification-config', async (req, res) => {
    const config = new Notification(req.body);
    try {
      await config.save();
      res.status(201).send(config);
    } catch (error) {
      res.status(400).send(error);
    }
});
  
router.get('/notification-config/:serviceType', async (req, res) => {
    try {
      const config = await Notification.findOne({ serviceType: req.params.serviceType });
      if (!config) {
        return res.status(404).send();
      }
      res.send(config);
    } catch (error) {
      res.status(500).send(error);
    }
});

router.get('/notifications', async (req, res) => {
  try {
    startConsumer();
    res.send("Email Enviado");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/signals', async (req, res) => {
  const signal = req.body;
  try {
    
    const timestamp = new Date(signal.dateTime);
    if (isNaN(timestamp.getTime())) {
      return res.status(400).json({ error: 'Invalid timestamp' });
    }

    const sensor = await Sensor.findOne({ id: signal.sensorId });
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    if (signal.propertyPath && signal.value !== undefined) {

      sensor.signals.push({
        timestamp: timestamp,
        propertyPath: signal.propertyPath,
        value: signal.value
      });
    } else if (signal.type && signal.description) {

      sensor.problems.push({
        type: signal.type,
        description: signal.description,
        timestamp: timestamp
      });
    } else {
      return res.status(400).json({ error: 'Invalid signal format' });
    }

    await sensor.save();

    await analyzeSignal(signal);

    res.status(201).send('Signal received and processed');
  } catch (error) {
    console.error('Error processing signal:', error);
    res.status(500).send(error);
  }
});

const queue = 'notification_queue';

const notify = async (notification: { method: any; recipients: any; signal: any; }) => {
  const { method, recipients, signal } = notification;

  console.log('Notification received:', notification);
  
  if (!signal || !signal.signalId) {
    console.log('Invalid signal object:', signal);
    return;
  }

  switch (method) {
    case 'email':
      await notifyByEmail(recipients, signal);
      break;
    default:
      console.log(`Unsupported notification method: ${method}`);
  }
};

const notifyByEmail = async (recipients: any[], signal: { signalId: any; }) => {
  console.log('Signal before sending email:', signal);
  console.log(`Email sent to ${recipients.join(', ')} with signal ${signal.signalId}`);
};

export const startConsumer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const notification = JSON.parse(msg.content.toString());
        await notify(notification);
        channel.ack(msg);
      }
    }, { noAck: false });

    console.log(`Listening for messages on queue: ${queue}`);
  } catch (error) {
    console.error('Error consuming messages from queue', error);
  }
};

export default router;
