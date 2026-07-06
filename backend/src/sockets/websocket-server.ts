import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import {
  setupPricesNamespace,
  setupTradesNamespace,
  setupPortfolioNamespace,
} from './socket-handlers';
import { PriceUpdate } from './types';

export interface WebSocketServer {
  io: Server;
  pricesNamespace: ReturnType<typeof setupPricesNamespace>;
  tradesNamespace: ReturnType<typeof setupTradesNamespace>;
  portfolioNamespace: ReturnType<typeof setupPortfolioNamespace>;
}

// Mock price data for testing (in production, fetch from API)
const mockPrices: PriceUpdate[] = [
  { coin_id: 1, symbol: 'BTC', name: 'Bitcoin', price: 42500, change24h: 2.5, marketCap: 850000000000, volume24h: 25000000000 },
  { coin_id: 2, symbol: 'ETH', name: 'Ethereum', price: 2300, change24h: 1.8, marketCap: 280000000000, volume24h: 12000000000 },
  { coin_id: 825, symbol: 'USDT', name: 'Tether', price: 1.0, change24h: 0.01, marketCap: 100000000000, volume24h: 50000000000 },
];

function generatePriceUpdates(): PriceUpdate[] {
  return mockPrices.map(price => ({
    ...price,
    price: price.price * (1 + (Math.random() - 0.5) * 0.02), // Random ±1% variation
    change24h: price.change24h + (Math.random() - 0.5) * 0.5,
  }));
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

  // Broadcast price updates every 2 seconds to all connected clients
  setInterval(() => {
    const updates = generatePriceUpdates();
    updates.forEach(update => {
      pricesNamespace.emit('price_update', update);
    });
    console.log(`Broadcasted ${updates.length} price updates to ${pricesNamespace.sockets.size} clients`);
  }, 2000);

  return {
    io,
    pricesNamespace,
    tradesNamespace,
    portfolioNamespace,
  };
}
