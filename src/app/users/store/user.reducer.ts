import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '../user.model';
import { UserActions } from './user.actions';

export const usersFeatureKey = 'users';

export interface UserState extends EntityState<User> {
  selectedUserId: string | null;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user._id,
});

export const initialState: UserState = adapter.getInitialState({
  selectedUserId: null,
});

export const reducer = createReducer(
  initialState,
  on(UserActions.loadUsersSuccess,
    (state, action) => adapter.setAll(action.users, state)
  ),
  on(UserActions.loadUsersFailure,
    state => adapter.removeAll(state)
  ),
  on(UserActions.setSelectedUserId,
    (state, { id }) => ({
      ...state,
      selectedUserId: id
    })
  ),
  on(UserActions.addUserSuccess,
    (state, { user }) => adapter.addOne(user, state)
  ),
  on(UserActions.addUserFailure,
    state => adapter.removeAll(state)
  ),
  on(UserActions.updateUserPortfolio, (state, { userId, portfolioTotal, cash }) =>
    adapter.updateOne(
      {
        id: userId,
        changes: { portfolio_total: portfolioTotal, cash },
      },
      state
    )
  )
);
export const usersFeature = createFeature({
  name: usersFeatureKey,
  reducer,
  extraSelectors: ({ selectUsersState }) => ({
    ...adapter.getSelectors(selectUsersState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = usersFeature;
