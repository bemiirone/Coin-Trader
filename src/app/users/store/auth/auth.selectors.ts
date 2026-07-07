import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);
export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state?.user || null
);
export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state?.error || null
);
export const selectForgotPasswordSuccess = createSelector(
  selectAuthState,
  (state: AuthState) => state?.forgotPasswordSuccess || false
);
export const selectResetPasswordSuccess = createSelector(
  selectAuthState,
  (state: AuthState) => state?.resetPasswordSuccess || false
);