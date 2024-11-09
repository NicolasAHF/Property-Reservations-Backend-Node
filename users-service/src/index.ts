import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/userModel';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/inmo2';


const loadInitialData = async () => {
  const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
  try {
    await User.deleteMany({});
    console.log('Existing users deleted');

    const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    await User.insertMany(users);
    console.log('Users loaded into database');
  } catch (err) {
    console.error('Error loading initial data', err);
  }
};

mongoose.connect(MONGO_URL, {})
  .then(async () => {
    console.log('Connected to MongoDB');
    await loadInitialData();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

const app = express();
app.use(express.json());

app.get('/users', async (req: Request, res: Response) => {
  const { email, name, surname, document } = req.query;

  try {
    let users;

    if (document) {
      users = await User.findOne({ document });
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(users);
    } else if (email) {
      users = await User.findOne({ email });
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(users);
    } else if (name || surname) {
      const query: any = {};
      if (name) query.name = { $regex: name, $options: 'i' };
      if (surname) query.surname = { $regex: surname, $options: 'i' };

      users = await User.find(query);

      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      return res.status(200).json(users);
    } else {
      users = await User.find();
      return res.status(200).json(users);
    }

  } catch (error) {
    console.error('Error fetching users');
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
