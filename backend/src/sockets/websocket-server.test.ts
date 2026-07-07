import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockServer = {
  of: vi.fn().mockReturnValue({
    on: vi.fn(),
    emit: vi.fn(),
    to: vi.fn().mockReturnValue({ emit: vi.fn() }),
    sockets: new Map(),
  }),
};

const mockPricesNs = {
  emit: vi.fn(),
  sockets: new Map(),
};

const mockTradesNs = {
  emit: vi.fn(),
  sockets: new Map(),
};

const mockPortfolioNs = {
  emit: vi.fn(),
  sockets: new Map(),
};

const mockPriceBroadcaster = {
  start: vi.fn(),
  stop: vi.fn(),
};

vi.mock('socket.io', () => ({
  Server: vi.fn(() => mockServer),
}));

vi.mock('./socket-handlers', () => ({
  setupPricesNamespace: vi.fn(() => mockPricesNs),
  setupTradesNamespace: vi.fn(() => mockTradesNs),
  setupPortfolioNamespace: vi.fn(() => mockPortfolioNs),
}));

vi.mock('../services/price-broadcaster', () => ({
  createPriceBroadcaster: vi.fn(() => mockPriceBroadcaster),
}));

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
    CMC_API_KEY: 'test-cmc-key',
    CMC_API_URL: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  },
}));

describe('WebSocket Server', () => {
  let mockHttpServer: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockHttpServer = {
      listen: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('initializeWebSocket', () => {
    it('should create Socket.IO server with correct CORS config', async () => {
      const { initializeWebSocket } = await import('./websocket-server');
      const { Server } = await import('socket.io');

      initializeWebSocket(mockHttpServer);

      expect(Server).toHaveBeenCalledWith(mockHttpServer, {
        cors: {
          origin: 'http://localhost:4200',
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });
    });

    it('should setup all three namespaces', async () => {
      const { initializeWebSocket } = await import('./websocket-server');
      const { setupPricesNamespace, setupTradesNamespace, setupPortfolioNamespace } = await import('./socket-handlers');

      initializeWebSocket(mockHttpServer);

      expect(setupPricesNamespace).toHaveBeenCalledWith(mockServer);
      expect(setupTradesNamespace).toHaveBeenCalledWith(mockServer);
      expect(setupPortfolioNamespace).toHaveBeenCalledWith(mockServer);
    });

    it('should return object with io and all namespaces', async () => {
      const { initializeWebSocket } = await import('./websocket-server');

      const result = initializeWebSocket(mockHttpServer);

      expect(result).toHaveProperty('io');
      expect(result).toHaveProperty('pricesNamespace');
      expect(result).toHaveProperty('tradesNamespace');
      expect(result).toHaveProperty('portfolioNamespace');
    });

    it('should initialize price broadcaster with 30 second interval', async () => {
      const { initializeWebSocket } = await import('./websocket-server');
      const { createPriceBroadcaster } = await import('../services/price-broadcaster');

      initializeWebSocket(mockHttpServer);

      expect(createPriceBroadcaster).toHaveBeenCalledWith(mockPricesNs);
      expect(mockPriceBroadcaster.start).toHaveBeenCalledWith(30000);
    });
  });
});
