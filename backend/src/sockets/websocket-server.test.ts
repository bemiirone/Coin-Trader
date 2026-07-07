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

vi.mock('socket.io', () => ({
  Server: vi.fn(() => mockServer),
}));

vi.mock('./socket-handlers', () => ({
  setupPricesNamespace: vi.fn(() => mockPricesNs),
  setupTradesNamespace: vi.fn(() => mockTradesNs),
  setupPortfolioNamespace: vi.fn(() => mockPortfolioNs),
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

    it('should broadcast price updates every 2 seconds', async () => {
      mockPricesNs.sockets = new Map([['socket1', {}], ['socket2', {}]]);

      const { initializeWebSocket } = await import('./websocket-server');
      initializeWebSocket(mockHttpServer);

      vi.advanceTimersByTime(2000);

      expect(mockPricesNs.emit).toHaveBeenCalledTimes(3);
      expect(mockPricesNs.emit).toHaveBeenCalledWith('price_update', expect.objectContaining({
        coin_id: expect.any(Number),
        symbol: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
        change24h: expect.any(Number),
        marketCap: expect.any(Number),
        volume24h: expect.any(Number),
      }));
    });

    it('should generate price updates with variations', async () => {
      const { initializeWebSocket } = await import('./websocket-server');
      initializeWebSocket(mockHttpServer);

      vi.advanceTimersByTime(2000);

      const calls = mockPricesNs.emit.mock.calls;
      const btcUpdate = calls.find((call: any[]) => call[1].symbol === 'BTC')?.[1];
      const ethUpdate = calls.find((call: any[]) => call[1].symbol === 'ETH')?.[1];
      const usdtUpdate = calls.find((call: any[]) => call[1].symbol === 'USDT')?.[1];

      expect(btcUpdate).toBeDefined();
      expect(ethUpdate).toBeDefined();
      expect(usdtUpdate).toBeDefined();

      expect(btcUpdate.price).toBeGreaterThan(0);
      expect(ethUpdate.price).toBeGreaterThan(0);
      expect(usdtUpdate.price).toBeGreaterThan(0);
    });

    it('should broadcast to correct number of clients', async () => {
      mockPricesNs.sockets = new Map([
        ['socket1', {}],
        ['socket2', {}],
        ['socket3', {}],
      ]);

      const { initializeWebSocket } = await import('./websocket-server');
      initializeWebSocket(mockHttpServer);

      vi.advanceTimersByTime(2000);

      expect(mockPricesNs.emit).toHaveBeenCalledTimes(3);
    });
  });
});
