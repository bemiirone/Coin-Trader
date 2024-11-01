import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { User } from '../user.model';

export const UserActions = createActionGroup({
  source: 'User/API',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),
    'Select User': props<{ id: string }>(),
    'Add User': props<{ user: User }>(),
    'Add User Success': props<{ user: User }>(),
    'Add User Failure': props<{ error: string }>(),
    'Upsert User': props<{ user: User }>(),
    'Add Users': props<{ users: User[] }>(),
    'Upsert Users': props<{ users: User[] }>(),
    'Update User': props<{ user: Update<User> }>(),
    'Update Users': props<{ users: Update<User>[] }>(),
    'Delete User': props<{ id: string }>(),
    'Delete Users': props<{ ids: string[] }>(),
    'Clear Users': emptyProps(),
  }
});
