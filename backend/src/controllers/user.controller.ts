import { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const SECRET_KEY = env.SECRET_KEY || 'test_secret_key';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, deposit } = req.body;
    
    if (!name || !email || !password || deposit === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, deposit, cash: deposit, portfolio_total: 0, admin: false });
    await newUser.save();

    res.status(201).json({ _id: newUser._id, name: newUser.name, email: newUser.email, deposit: newUser.deposit });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, admin: user.admin }, SECRET_KEY, { expiresIn: '1h' });
  res.send({ token, user });
};