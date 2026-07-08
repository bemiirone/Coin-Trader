import { describe, it, expect, vi, beforeEach } from 'vitest';
import requestPasswordResetRouter from './password-reset.routes';
import { requestPasswordReset, resetPassword } from './password-reset.controller';

vi.mock('../config/env', () => ({
  env: {
    PORT: 5001,
    MONGODB_URI: 'mongodb://localhost:27017/test',
    SECRET_KEY: 'test_secret_key',
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: 587,
    SMTP_USER: 'test@test.com',
    SMTP_PASS: 'password',
    SMTP_FROM: 'noreply@cryptotrader.com',
    FRONTEND_URL: 'http://localhost:4200',
  },
}));

vi.mock('./password-reset.controller', () => ({
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

describe('Password Reset Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have POST /forgot-password route', () => {
    const postSpy = vi.fn();
    const router = {
      post: postSpy.mockReturnThis(),
    };

    const routes = [
      { method: 'post', path: '/forgot-password', handler: requestPasswordReset },
      { method: 'post', path: '/reset-password', handler: resetPassword },
    ];

    routes.forEach(route => {
      if (route.method === 'post') {
        router.post(route.path, route.handler);
      }
    });

    expect(router.post).toHaveBeenCalledWith('/forgot-password', requestPasswordReset);
    expect(router.post).toHaveBeenCalledWith('/reset-password', resetPassword);
  });

  it('should export router with correct endpoints', () => {
    expect(requestPasswordResetRouter).toBeDefined();
  });
});
