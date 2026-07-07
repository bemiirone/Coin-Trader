import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  setupPricesNamespace,
  setupTradesNamespace,
  setupPortfolioNamespace,
  emitPriceUpdate,
  emitTradeNotification,
  emitPortfolioUpdate,
} from './socket-handlers';
import { PriceUpdate, TradeNotification, PortfolioUpdate } from './types';

const SECRET_KEY = 'test_secret_key';

vi.mock('../config/env', () => ({
  env: {
    PORT: 5001,
    MONGODB_URI: 'mongodb://localhost:27017/test',
    SECRET_KEY: 'test_secret_key',
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: 587,
    SMTP_USER: '',
    SMTP_PASS: '',
    SMTP_FROM: 'noreply@cryptotrader.com',
    FRONTEND_URL: 'http://localhost:4200',
  },
}));

function createMockSocket(authToken?: string) {
  const handlers: Record<string, Function> = {};
  return {
    id: 'test-socket-id',
    handshake: {
      auth: { token: authToken },
      query: {},
    },
    on: vi.fn((event: string, callback: Function) => {
      handlers[event] = callback;
    }),
    emit: vi.fn(),
    disconnect: vi.fn(),
    join: vi.fn(),
    handlers,
  };
}

function createMockServer() {
  const namespaces: Record<string, any> = {};
  const server = {
    of: vi.fn((namespace: string) => {
      if (!namespaces[namespace]) {
        const handlers: Record<string, Function> = {};
        namespaces[namespace] = {
          on: vi.fn((event: string, callback: Function) => {
            handlers[event] = callback;
          }),
          emit: vi.fn(),
          to: vi.fn(() => ({
            emit: vi.fn(),
          })),
          handlers,
        };
      }
      return namespaces[namespace];
    }),
    namespaces,
  };
  return server;
}

function generateToken(userId: string, admin: boolean = false): string {
  return jwt.sign({ id: userId, admin }, SECRET_KEY, { expiresIn: '1h' });
}

describe('Socket Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setupPricesNamespace', () => {
    it('should create /prices namespace', () => {
      const server = createMockServer();
      setupPricesNamespace(server as any);

      expect(server.of).toHaveBeenCalledWith('/prices');
    });

    it('should accept connection with valid token', () => {
      const server = createMockServer();
      const ns = setupPricesNamespace(server as any);
      const mockSocket = createMockSocket(generateToken('user1'));

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('connected', {
        message: 'Connected to prices namespace',
      });
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it('should reject connection with invalid token', () => {
      const server = createMockServer();
      const ns = setupPricesNamespace(server as any);
      const mockSocket = createMockSocket('invalid-token');

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('error', { message: 'Unauthorized' });
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should reject connection with no token', () => {
      const server = createMockServer();
      const ns = setupPricesNamespace(server as any);
      const mockSocket = createMockSocket();

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('error', { message: 'Unauthorized' });
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should handle disconnect event', () => {
      const server = createMockServer();
      const ns = setupPricesNamespace(server as any);
      const mockSocket = createMockSocket(generateToken('user1'));

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });
  });

  describe('setupTradesNamespace', () => {
    it('should create /trades namespace', () => {
      const server = createMockServer();
      setupTradesNamespace(server as any);

      expect(server.of).toHaveBeenCalledWith('/trades');
    });

    it('should accept connection with valid token', () => {
      const server = createMockServer();
      const ns = setupTradesNamespace(server as any);
      const mockSocket = createMockSocket(generateToken('user1'));

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('connected', {
        message: 'Connected to trades namespace',
      });
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it('should reject connection with invalid token', () => {
      const server = createMockServer();
      const ns = setupTradesNamespace(server as any);
      const mockSocket = createMockSocket('invalid-token');

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('error', { message: 'Unauthorized' });
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should handle disconnect event', () => {
      const server = createMockServer();
      const ns = setupTradesNamespace(server as any);
      const mockSocket = createMockSocket(generateToken('user1'));

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });
  });

  describe('setupPortfolioNamespace', () => {
    it('should create /portfolio namespace', () => {
      const server = createMockServer();
      setupPortfolioNamespace(server as any);

      expect(server.of).toHaveBeenCalledWith('/portfolio');
    });

    it('should accept connection with valid token and join user room', () => {
      const server = createMockServer();
      const ns = setupPortfolioNamespace(server as any);
      const mockSocket = createMockSocket(generateToken('user123'));

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.join).toHaveBeenCalledWith('user:user123');
      expect(mockSocket.emit).toHaveBeenCalledWith('connected', {
        message: 'Connected to portfolio namespace',
      });
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it('should reject connection with invalid token', () => {
      const server = createMockServer();
      const ns = setupPortfolioNamespace(server as any);
      const mockSocket = createMockSocket('invalid-token');

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('error', { message: 'Unauthorized' });
      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(mockSocket.join).not.toHaveBeenCalled();
    });

    it('should handle disconnect event', () => {
      const server = createMockServer();
      const ns = setupPortfolioNamespace(server as any);
      const mockSocket = createMockSocket(generateToken('user1'));

      ns.handlers['connection'](mockSocket);

      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });
  });

  describe('emitPriceUpdate', () => {
    it('should emit price_update to all clients', () => {
      const mockNs = {
        emit: vi.fn(),
      };

      const priceUpdate: PriceUpdate = {
        coin_id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 42500,
        change24h: 2.5,
        marketCap: 850000000000,
        volume24h: 25000000000,
      };

      emitPriceUpdate(mockNs as any, priceUpdate);

      expect(mockNs.emit).toHaveBeenCalledWith('price_update', priceUpdate);
    });
  });

  describe('emitTradeNotification', () => {
    it('should emit trade_notification to all clients', () => {
      const mockNs = {
        emit: vi.fn(),
      };

      const tradeNotification: TradeNotification = {
        _id: 'trade123',
        user_id: 'user1',
        coin_id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.5,
        price: 42500,
        volume: 21250,
        order: 'buy',
        date: '2024-01-01T00:00:00Z',
      };

      emitTradeNotification(mockNs as any, tradeNotification);

      expect(mockNs.emit).toHaveBeenCalledWith('trade_notification', tradeNotification);
    });
  });

  describe('emitPortfolioUpdate', () => {
    it('should emit portfolio_update to specific user room', () => {
      const mockEmit = vi.fn();
      const mockTo = vi.fn(() => ({ emit: mockEmit }));
      const mockNs = {
        to: mockTo,
      };

      const portfolioUpdate: PortfolioUpdate = {
        userId: 'user123',
        portfolio_total: 10000,
        cash: 5000,
        deposit: 5000,
      };

      emitPortfolioUpdate(mockNs as any, portfolioUpdate);

      expect(mockTo).toHaveBeenCalledWith('user:user123');
      expect(mockEmit).toHaveBeenCalledWith('portfolio_update', portfolioUpdate);
    });
  });
});
