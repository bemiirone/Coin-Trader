import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { env } from './config/env';

import userRoutes from './routes/user.routes';
import tradeRoutes from './routes/trade.routes';
import { initializeWebSocket } from './sockets';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// MongoDB Connection
mongoose.connect(env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

app.use('/api/users', userRoutes);
app.use('/api/trades', tradeRoutes);

const PORT = env.PORT || 5001;
const httpServer = createServer(app);

// Initialize WebSocket server
const wsServer = initializeWebSocket(httpServer);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { app, httpServer, wsServer };
