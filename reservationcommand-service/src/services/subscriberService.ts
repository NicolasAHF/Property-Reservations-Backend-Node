import amqp from 'amqplib';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

const queueCreated = 'reservation_created';
const queuePaid = 'reservation_paid';

interface Notifications {
  [email: string]: string[];
}

const notifyAdminsAndOwner = async (reservation: any, eventType: string): Promise<Notifications> => {
  const users = (await axios.get(`${process.env.USERS_SERVICE_URL}/users`)).data;
  const property = (await axios.get(`${process.env.PROPERTY_SERVICE_URL}/api/property/${reservation.propertyId}`)).data;

  const admins = users.filter((user: { role: string; }) => user.role === 'Administrador').map((user: { email: any; }) => user.email);
  const ownerEmail = property.ownerEmail;

  const notifications: Notifications = {};

  admins.forEach((email: string) => {
    if (!notifications[email]) {
      notifications[email] = [];
    }
    notifications[email].push(`Reservation ${eventType} successfully with ID: ${reservation.id}`);
  });

  if (!notifications[ownerEmail]) {
    notifications[ownerEmail] = [];
  }
  notifications[ownerEmail].push(`Your property has a reservation ${eventType} with ID: ${reservation.id}`);

  return notifications;
};

const consumeQueue = async (channel: any, queue: string, allNotifications: Notifications) => {
  await channel.assertQueue(queue, { durable: true });

  return new Promise<void>((resolve, reject) => {
    channel.consume(queue, async (msg: { content: { toString: () => string; }; } | null) => {
      if (msg !== null) {
        const reservation = JSON.parse(msg.content.toString());
        const eventType = queue === queueCreated ? 'created' : 'paid';
        const reservationNotifications = await notifyAdminsAndOwner(reservation, eventType);

        Object.entries(reservationNotifications).forEach(([email, messages]) => {
          if (!allNotifications[email]) {
            allNotifications[email] = [];
          }
          allNotifications[email].push(...messages);
        });

        channel.ack(msg);
      } else {
        resolve();
      }
    }, { noAck: false });

    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const getNotificationsFromQueue = async () => {
  const allNotifications: Notifications = {};
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await Promise.all([
      consumeQueue(channel, queueCreated, allNotifications),
      consumeQueue(channel, queuePaid, allNotifications),
    ]);

    channel.close();
    connection.close();
  } catch (error) {
    console.error('Error consuming messages from queue', error);
  }

  return allNotifications;
};