import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: unknown }>(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Noop': emptyProps(),
    'Forgot Password': props<{ email: string }>(),
    'Forgot Password Success': emptyProps(),
    'Forgot Password Failure': props<{ error: unknown }>(),
    'Reset Password': props<{ token: string; password: string }>(),
    'Reset Password Success': emptyProps(),
    'Reset Password Failure': props<{ error: unknown }>(),
  },
});
