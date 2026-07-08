import * as fromAuth from './auth.selectors';
import { AuthState } from './auth.reducer';
import { User } from '../../user.model';

describe('Auth Selectors', () => {
  const mockUser: User = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: '',
    admin: false,
    portfolio_total: 0,
    deposit: 0,
    cash: 0,
  };

  describe('selectAuthState', () => {
    it('should select the auth feature state', () => {
      const state = {
        auth: {
          user: mockUser,
          token: 'test-token',
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectAuthState(state as any);

      expect(result).toEqual(state.auth);
    });
  });

  describe('selectAuthToken', () => {
    it('should return the token from auth state', () => {
      const state = {
        auth: {
          user: mockUser,
          token: 'test-token',
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectAuthToken(state as any);

      expect(result).toBe('test-token');
    });

    it('should return null if no token', () => {
      const state = {
        auth: {
          user: null,
          token: null,
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectAuthToken(state as any);

      expect(result).toBeNull();
    });
  });

  describe('selectAuthUser', () => {
    it('should return the user from auth state', () => {
      const state = {
        auth: {
          user: mockUser,
          token: 'test-token',
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectAuthUser(state as any);

      expect(result).toEqual(mockUser);
    });

    it('should return null if no user', () => {
      const state = {
        auth: {
          user: null,
          token: null,
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectAuthUser(state as any);

      expect(result).toBeNull();
    });
  });

  describe('selectAuthError', () => {
    it('should return the error from auth state', () => {
      const state = {
        auth: {
          user: null,
          token: null,
          error: 'Login failed',
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectAuthError(state as any);

      expect(result).toBe('Login failed');
    });

    it('should return null if no error', () => {
      const state = {
        auth: {
          user: null,
          token: null,
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectAuthError(state as any);

      expect(result).toBeNull();
    });
  });

  describe('selectForgotPasswordSuccess', () => {
    it('should return forgotPasswordSuccess from auth state', () => {
      const state = {
        auth: {
          user: null,
          token: null,
          error: null,
          forgotPasswordSuccess: true,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectForgotPasswordSuccess(state as any);

      expect(result).toBe(true);
    });

    it('should return false if forgotPasswordSuccess is false', () => {
      const state = {
        auth: {
          user: null,
          token: null,
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectForgotPasswordSuccess(state as any);

      expect(result).toBe(false);
    });

    it('should return false if state is undefined', () => {
      const state = {
        auth: undefined,
      };

      const result = fromAuth.selectForgotPasswordSuccess(state as any);

      expect(result).toBe(false);
    });
  });

  describe('selectResetPasswordSuccess', () => {
    it('should return resetPasswordSuccess from auth state', () => {
      const state = {
        auth: {
          user: null,
          token: null,
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: true,
        } as AuthState,
      };

      const result = fromAuth.selectResetPasswordSuccess(state as any);

      expect(result).toBe(true);
    });

    it('should return false if resetPasswordSuccess is false', () => {
      const state = {
        auth: {
          user: null,
          token: null,
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
        } as AuthState,
      };

      const result = fromAuth.selectResetPasswordSuccess(state as any);

      expect(result).toBe(false);
    });

    it('should return false if state is undefined', () => {
      const state = {
        auth: undefined,
      };

      const result = fromAuth.selectResetPasswordSuccess(state as any);

      expect(result).toBe(false);
    });
  });
});
