import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import {
  setupPricesNamespace,
  setupTradesNamespace,
  setupPortfolioNamespace,
} from './socket-handlers';
import { createPriceBroadcaster } from '../services/price-broadcaster';

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

  // Initialize price broadcaster with real CMC API data (30 second interval)
  const priceBroadcaster = createPriceBroadcaster(pricesNamespace);
  priceBroadcaster.start(30000);

  return {
    io,
    pricesNamespace,
    tradesNamespace,
    portfolioNamespace,
  };
}
