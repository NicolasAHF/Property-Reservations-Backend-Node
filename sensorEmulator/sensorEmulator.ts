// sensorEmulator.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const config = {
  url: 'http://localhost:3005/api/signals',
  ratePerMinute: 60,
  sensors: [
    {
      sensorId: "SEC-10021",
      propertyPath: 'motion',
      minValue: 0,
      maxValue: 1
    }
  ]
};

function getRandomValue(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const emitSensorData = async () => {
  const promises = config.sensors.map(sensor => {
    const value = getRandomValue(sensor.minValue, sensor.maxValue);
    const signal = {
      sensorId: sensor.sensorId,
      dateTime: new Date().toISOString(),
      propertyPath: sensor.propertyPath,
      value: value
    };
    console.log(signal)

    return axios.post(config.url, signal)
      .then((response: { data: any; }) => {
        console.log(`Data sent for sensor ${sensor.sensorId}:`, response.data);
      })
      .catch((error: { message: any; }) => {
        console.error(`Error sending data for sensor ${sensor.sensorId}:`, error.message);
      });
  });

  await Promise.all(promises);
};

const startEmulation = () => {
  const interval = 60000 / config.ratePerMinute;
  setInterval(emitSensorData, interval);
  console.log(`Sensor emulation started with rate ${config.ratePerMinute} requests per minute.`);
};

startEmulation();
