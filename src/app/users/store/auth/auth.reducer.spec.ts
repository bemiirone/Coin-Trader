import { authReducer, initialState, AuthState } from './auth.reducer';
import { AuthActions } from './auth.actions';
import { User } from '../../user.model';

describe('Auth Reducer', () => {
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

  describe('initial state', () => {
    it('should have the correct initial state', () => {
      expect(initialState).toEqual({
        user: null,
        token: null,
        error: null,
        forgotPasswordSuccess: false,
        resetPasswordSuccess: false,
      });
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = authReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('loginSuccess', () => {
    it('should set user and token, clear error', () => {
      const result = authReducer(initialState, AuthActions.loginSuccess({ user: mockUser, token: 'token123' }));

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('token123');
      expect(result.error).toBeNull();
    });
  });

  describe('loginFailure', () => {
    it('should set error', () => {
      const result = authReducer(initialState, AuthActions.loginFailure({ error: 'Invalid credentials' }));

      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('logoutSuccess', () => {
    it('should reset to initial state', () => {
      const loggedInState: AuthState = {
        user: mockUser,
        token: 'token123',
        error: null,
        forgotPasswordSuccess: true,
        resetPasswordSuccess: true,
      };

      const result = authReducer(loggedInState, AuthActions.logoutSuccess());

      expect(result).toEqual(initialState);
    });
  });

  describe('forgotPassword', () => {
    it('should clear error and reset forgotPasswordSuccess', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Previous error',
        forgotPasswordSuccess: true,
      };

      const result = authReducer(stateWithError, AuthActions.forgotPassword({ email: 'test@example.com' }));

      expect(result.error).toBeNull();
      expect(result.forgotPasswordSuccess).toBe(false);
    });
  });

  describe('forgotPasswordSuccess', () => {
    it('should set forgotPasswordSuccess to true and clear error', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error',
        forgotPasswordSuccess: false,
      };

      const result = authReducer(stateWithError, AuthActions.forgotPasswordSuccess());

      expect(result.forgotPasswordSuccess).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('forgotPasswordFailure', () => {
    it('should set error and reset forgotPasswordSuccess', () => {
      const result = authReducer(initialState, AuthActions.forgotPasswordFailure({ error: 'Network error' }));

      expect(result.error).toBe('Network error');
      expect(result.forgotPasswordSuccess).toBe(false);
    });

    it('should overwrite previous error', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Old error',
        forgotPasswordSuccess: true,
      };

      const result = authReducer(stateWithError, AuthActions.forgotPasswordFailure({ error: 'New error' }));

      expect(result.error).toBe('New error');
      expect(result.forgotPasswordSuccess).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should clear error and reset resetPasswordSuccess', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Previous error',
        resetPasswordSuccess: true,
      };

      const result = authReducer(stateWithError, AuthActions.resetPassword({ token: 'token', password: 'newpass' }));

      expect(result.error).toBeNull();
      expect(result.resetPasswordSuccess).toBe(false);
    });
  });

  describe('resetPasswordSuccess', () => {
    it('should set resetPasswordSuccess to true and clear error', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error',
        resetPasswordSuccess: false,
      };

      const result = authReducer(stateWithError, AuthActions.resetPasswordSuccess());

      expect(result.resetPasswordSuccess).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('resetPasswordFailure', () => {
    it('should set error and reset resetPasswordSuccess', () => {
      const result = authReducer(initialState, AuthActions.resetPasswordFailure({ error: 'Invalid token' }));

      expect(result.error).toBe('Invalid token');
      expect(result.resetPasswordSuccess).toBe(false);
    });

    it('should overwrite previous error', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Old error',
        resetPasswordSuccess: true,
      };

      const result = authReducer(stateWithError, AuthActions.resetPasswordFailure({ error: 'New error' }));

      expect(result.error).toBe('New error');
      expect(result.resetPasswordSuccess).toBe(false);
    });
  });
});
