import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { User } from '../user.model';

export const UserActions = createActionGroup({
  source: 'User/API',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),
    'Set Selected User Id': props<{ id: string }>(),
    'Add User': props<{ user: User }>(),
    'Add User Success': props<{ user: User }>(),
    'Add User Failure': props<{ error: string }>(),
    'Add Users': props<{ users: User[] }>(),
    'Update User Portfolio': props<{ userId: string, portfolioTotal: number, cash: number }>(),
    'Update User Portfolio Success': props<{ user: User }>(),
    'Update User Portfolio Failure': props<{ error: string }>(),
  }
});
