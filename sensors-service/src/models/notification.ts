import mongoose from "mongoose";


const notificationConfigSchema = new mongoose.Schema({
    serviceType: { type: String, required: true },
    recipients: { type: [String], required: true }
});

export const Notification = mongoose.model('Notification', notificationConfigSchema);