import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../../user.model';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  forgotPasswordSuccess: boolean;
  resetPasswordSuccess: boolean;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error: error as string,
  })),
  on(AuthActions.logoutSuccess, () => initialState),
  on(AuthActions.forgotPassword, (state) => ({
    ...state,
    error: null,
    forgotPasswordSuccess: false,
  })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({
    ...state,
    forgotPasswordSuccess: true,
    error: null,
  })),
  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
    ...state,
    error: error as string,
    forgotPasswordSuccess: false,
  })),
  on(AuthActions.resetPassword, (state) => ({
    ...state,
    error: null,
    resetPasswordSuccess: false,
  })),
  on(AuthActions.resetPasswordSuccess, (state) => ({
    ...state,
    resetPasswordSuccess: true,
    error: null,
  })),
  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    error: error as string,
    resetPasswordSuccess: false,
  }))
);

export const authFeature = {
  name: authFeatureKey,
  reducer: authReducer,
};
