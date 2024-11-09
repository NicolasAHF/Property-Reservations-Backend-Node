import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  type: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const sensorSchema = new mongoose.Schema({
    id: { type: String, required: true, maxlength: 15 },
    description: { type: String, required: true, maxlength: 200 },
    serialNumber: { type: String, maxlength: 45 },
    brand: { type: String, maxlength: 50 },
    serviceAddress: { type: String, maxlength: 1000 },
    lastCheckDate: { type: Date, required: true },
    serviceType: { type: String, required: true },
    observableProperties: [
      {
        propertyPath: { type: String, required: true, maxlength: 1000 },
        unitOfMeasurement: { type: String },
        alertRegex: { type: String },
        validRange: {
          min: { type: Number },
          max: { type: Number }
        }
      }
    ],
    signals: [{
      timestamp: { type: Date, required: true },
      propertyPath: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true }
    }],
    problems: [problemSchema]
});

export const Sensor = mongoose.model('Sensor', sensorSchema);