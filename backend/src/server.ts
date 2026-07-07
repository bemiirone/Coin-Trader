import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';

import userRoutes from './routes/user.routes';
import tradeRoutes from './routes/trade.routes';
import passwordResetRoutes from './routes/password-reset.routes';
import coinsRoutes from './routes/coins.routes';
import { initializeWebSocket } from './sockets';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());
app.use(cors({ origin: env.FRONTEND_URL || 'http://localhost:4200' }));

// MongoDB Connection
mongoose.connect(env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

app.use('/api/users', userRoutes);
app.use('/api/users/password-reset', passwordResetRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/coins', coinsRoutes);

const PORT = env.PORT || 5001;
const httpServer = createServer(app);

// Initialize WebSocket server
const wsServer = initializeWebSocket(httpServer);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { app, httpServer, wsServer };
