import { Server, Namespace } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { DecodedToken, PriceUpdate, TradeNotification, PortfolioUpdate } from './types';

const SECRET_KEY = env.SECRET_KEY || 'test_secret_key';

function verifySocketToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, SECRET_KEY) as DecodedToken;
  } catch {
    return null;
  }
}

export function setupPricesNamespace(io: Server): Namespace {
  const pricesNs = io.of('/prices');

  pricesNs.on('connection', (socket) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token as string;
    const decoded = verifySocketToken(token);

    if (!decoded) {
      socket.emit('error', { message: 'Unauthorized' });
      socket.disconnect();
      return;
    }

    console.log(`Client connected to /prices: ${socket.id} (user: ${decoded.id})`);

    socket.emit('connected', { message: 'Connected to prices namespace' });

    socket.on('disconnect', () => {
      console.log(`Client disconnected from /prices: ${socket.id}`);
    });
  });

  return pricesNs;
}

export function setupTradesNamespace(io: Server): Namespace {
  const tradesNs = io.of('/trades');

  tradesNs.on('connection', (socket) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token as string;
    const decoded = verifySocketToken(token);

    if (!decoded) {
      socket.emit('error', { message: 'Unauthorized' });
      socket.disconnect();
      return;
    }

    console.log(`Client connected to /trades: ${socket.id} (user: ${decoded.id})`);

    socket.emit('connected', { message: 'Connected to trades namespace' });

    socket.on('disconnect', () => {
      console.log(`Client disconnected from /trades: ${socket.id}`);
    });
  });

  return tradesNs;
}

export function setupPortfolioNamespace(io: Server): Namespace {
  const portfolioNs = io.of('/portfolio');

  portfolioNs.on('connection', (socket) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token as string;
    const decoded = verifySocketToken(token);

    if (!decoded) {
      socket.emit('error', { message: 'Unauthorized' });
      socket.disconnect();
      return;
    }

    socket.join(`user:${decoded.id}`);

    console.log(`Client connected to /portfolio: ${socket.id} (user: ${decoded.id})`);

    socket.emit('connected', { message: 'Connected to portfolio namespace' });

    socket.on('disconnect', () => {
      console.log(`Client disconnected from /portfolio: ${socket.id}`);
    });
  });

  return portfolioNs;
}

export function emitPriceUpdate(pricesNs: Namespace, data: PriceUpdate): void {
  pricesNs.emit('price_update', data);
}

export function emitTradeNotification(tradesNs: Namespace, data: TradeNotification): void {
  tradesNs.emit('trade_notification', data);
}

export function emitPortfolioUpdate(portfolioNs: Namespace, data: PortfolioUpdate): void {
  portfolioNs.to(`user:${data.userId}`).emit('portfolio_update', data);
}
