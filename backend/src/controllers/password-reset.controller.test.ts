import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import { requestPasswordReset, resetPassword } from './password-reset.controller';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../services/email.service';

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

vi.mock('../models/user.model', () => ({
  User: {
    findOne: vi.fn(),
  },
}));

vi.mock('bcrypt', () => {
  const mockHash = vi.fn().mockResolvedValue('hashed-value');
  const mockCompare = vi.fn().mockResolvedValue(true);
  return {
    default: {
      hash: mockHash,
      compare: mockCompare,
    },
    hash: mockHash,
    compare: mockCompare,
  };
});

vi.mock('crypto', () => ({
  default: {
    randomBytes: vi.fn().mockReturnValue({ toString: () => 'mock-reset-token' }),
  },
}));

vi.mock('../services/email.service', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

function createMockRequest(body: any = {}): Partial<Request> {
  return { body };
}

function createMockResponse(): { res: Partial<Response>; json: ReturnType<typeof vi.fn>; status: ReturnType<typeof vi.fn> } {
  const json = vi.fn().mockReturnThis();
  const status = vi.fn().mockReturnValue({ json });
  return {
    res: { status, json },
    json,
    status,
  };
}

describe('Password Reset Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('requestPasswordReset', () => {
    it('should return 400 when email is missing', async () => {
      const req = createMockRequest({});
      const { res, json, status } = createMockResponse();

      await requestPasswordReset(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Email is required' });
    });

    it('should return 200 with security message when user not found', async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      const req = createMockRequest({ email: 'notfound@example.com' });
      const { res, json, status } = createMockResponse();

      await requestPasswordReset(req as Request, res as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: 'If an account with that email exists, a reset link has been sent' });
    });

    it('should return 500 on unexpected errors', async () => {
      vi.mocked(User.findOne).mockRejectedValue(new Error('Database error'));

      const req = createMockRequest({ email: 'test@example.com' });
      const { res, json, status } = createMockResponse();

      await requestPasswordReset(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('resetPassword', () => {
    it('should return 400 when token is missing', async () => {
      const req = createMockRequest({ password: 'newpassword' });
      const { res, json, status } = createMockResponse();

      await resetPassword(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Token and password are required' });
    });

    it('should return 400 when password is missing', async () => {
      const req = createMockRequest({ token: 'reset-token' });
      const { res, json, status } = createMockResponse();

      await resetPassword(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Token and password are required' });
    });

    it('should return 400 when password is less than 6 characters', async () => {
      const req = createMockRequest({ token: 'reset-token', password: '123' });
      const { res, json, status } = createMockResponse();

      await resetPassword(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Password must be at least 6 characters' });
    });

    it('should return 400 when no user found with valid token', async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      const req = createMockRequest({ token: 'reset-token', password: 'newpassword' });
      const { res, json, status } = createMockResponse();

      await resetPassword(req as Request, res as Response);

      expect(User.findOne).toHaveBeenCalledWith({
        resetPasswordToken: { $exists: true },
        resetPasswordExpires: { $gt: expect.any(Date) },
      });
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Invalid or expired reset token' });
    });

    it('should return 400 when token does not match', async () => {
      const mockUser = {
        email: 'test@example.com',
        resetPasswordToken: 'hashed-token',
        resetPasswordExpires: new Date(Date.now() + 3600000),
        password: '',
        save: vi.fn().mockResolvedValue(true),
      };
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const req = createMockRequest({ token: 'wrong-token', password: 'newpassword' });
      const { res, json, status } = createMockResponse();

      await resetPassword(req as Request, res as Response);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrong-token', 'hashed-token');
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Invalid or expired reset token' });
    });

    it('should hash password, clear token, and save user on success', async () => {
      const mockUser = {
        email: 'test@example.com',
        resetPasswordToken: 'hashed-token',
        resetPasswordExpires: new Date(Date.now() + 3600000),
        password: 'old-hashed-password',
        save: vi.fn().mockResolvedValue(true),
      };
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed-password');

      const req = createMockRequest({ token: 'valid-token', password: 'newpassword' });
      const { res, json, status } = createMockResponse();

      await resetPassword(req as Request, res as Response);

      expect(bcrypt.compare).toHaveBeenCalledWith('valid-token', 'hashed-token');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(mockUser.password).toBe('new-hashed-password');
      expect(mockUser.resetPasswordToken).toBeUndefined();
      expect(mockUser.resetPasswordExpires).toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: 'Password reset successful' });
    });

    it('should return 500 on unexpected errors', async () => {
      vi.mocked(User.findOne).mockRejectedValue(new Error('Database error'));

      const req = createMockRequest({ token: 'token', password: 'newpassword' });
      const { res, json, status } = createMockResponse();

      await resetPassword(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
