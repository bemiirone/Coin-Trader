import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import {
  setupPricesNamespace,
  setupTradesNamespace,
  setupPortfolioNamespace,
} from './socket-handlers';

export interface WebSocketServer {
  io: Server;
  pricesNamespace: ReturnType<typeof setupPricesNamespace>;
  tradesNamespace: ReturnType<typeof setupTradesNamespace>;
  portfolioNamespace: ReturnType<typeof setupPortfolioNamespace>;
}

export function initializeWebSocket(httpServer: HttpServer): WebSocketServer {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const pricesNamespace = setupPricesNamespace(io);
  const tradesNamespace = setupTradesNamespace(io);
  const portfolioNamespace = setupPortfolioNamespace(io);

  console.log('Socket.IO server initialized');

  return {
    io,
    pricesNamespace,
    tradesNamespace,
    portfolioNamespace,
  };
}
