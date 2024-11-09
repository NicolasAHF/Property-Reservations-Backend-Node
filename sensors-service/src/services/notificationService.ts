import { Notification } from '../models/notification';
import { Sensor } from '../models/sensor';
import dotenv from 'dotenv';
import amqp from 'amqplib';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';


const publishToQueue = async (queue: string, message: any) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Message sent to queue: ${queue}`);
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error('Error publishing to queue', error);
  }
};


type Signal = { 
    sensorId: string; 
    dateTime: string; 
    type?: string; 
    description?: string; 
    propertyPath?: string; 
    value?: any 
};

export const analyzeSignal = async (signal: Signal) => {
    try {
        const sensor = await Sensor.findOne({ id: signal.sensorId });
        if (!sensor) {
            console.log('Sensor no encontrado o no asignado');
            return;
        }

        const timestamp = new Date(signal.dateTime);
        if (isNaN(timestamp.getTime())) {
            console.error('Fecha inválida:', signal.dateTime);
            return;
        }

        let problemType = '';

        if (signal.type && signal.description) {
            sensor.problems.push({
                type: signal.type,
                description: signal.description,
                timestamp: timestamp
            });
            await sensor.save();
            console.log('Problema reportado manualmente registrado con éxito');
        } else if (signal.propertyPath && signal.value !== undefined) {
            const observableProperty = sensor.observableProperties.find(prop => prop.propertyPath === signal.propertyPath);
            if (!observableProperty) {
                console.log('Propiedad observable no encontrada');
                return;
            }

            const value = signal.value;
            let isValid = true;
            problemType = '';

            if (observableProperty.validRange) {
                console.log(observableProperty.validRange)
                const { min, max } = observableProperty.validRange;
                if ((min !== undefined && min !== null && value < min) || (max !== undefined && max !== null && value > max)) {
                    isValid = false;
                    problemType = 'Range Violation';
                }
            }

            if (observableProperty.alertRegex) {
                console.log(observableProperty.alertRegex)
                const regex = new RegExp(observableProperty.alertRegex);
                if (!regex.test(value.toString())) {
                    isValid = false;
                    problemType = 'Regex Violation';
                }
            }

            if (isValid) {
                console.log('Señal válida');
                sensor.signals.push({
                    type: 'Sin problemas', 
                    description: `Señan valida`, 
                    timestamp: timestamp,
                    propertyPath: signal.propertyPath,
                    value: signal.value
                });
                await sensor.save();
            } else {
                console.log('Señal inválida');
                sensor.problems.push({ 
                    type: problemType, 
                    description: `Invalid value: ${value}`, 
                    timestamp: timestamp 
                });
                sensor.signals.push({
                    timestamp: timestamp,
                    propertyPath: signal.propertyPath,
                    value: signal.value
                });
                await sensor.save();
            }

        }

        const config = await Notification.findOne({ serviceType: sensor.serviceType });
        if (config) {
            const recipients = config.recipients;
            const subject = `Alerta de ${sensor.serviceType}`;
            const message = {
                method: "email",
                recipients: recipients,
                signal: {
                    signalId: sensor.id
                },
                description: signal.description,
                type: signal.type || problemType,
                subject: subject
            };
            await publishToQueue('notification_queue', message);
        }

    } catch (error) {
        console.error('Error al analizar la señal:', error);
    }
};
