import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    document: { type: String, required: true, unique: true },
    documentType: { type: String, required: true },
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    surname: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
    phoneNumber: { type: String, required: true },
    role: { type: String, required: true, enum: ['Administrador', 'Operario', 'Propietario', 'Inquilino'] },
    password: { type: String, required: true },
    bankAccountId: { type: String, required: true },
    country: { type: String, required: true },
  });
  
export const User = mongoose.model('User', userSchema);