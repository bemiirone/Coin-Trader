import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../user.model';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user, token }) => ({ ...state, user, token, error: null })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error: error as string })),
  on(AuthActions.logout, () => initialState)
);

