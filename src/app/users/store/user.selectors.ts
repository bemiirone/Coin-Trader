import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, adapter } from './user.reducer';
import e from 'express';

export const selectUserState = createFeatureSelector<UserState>('users');
const { selectAll, selectIds, selectEntities, selectTotal } = adapter.getSelectors( selectUserState );

export const selectAllUsers = selectAll;
export const selectUserIds = selectIds;
export const selectUserEntities = selectEntities;
export const selectUserTotal = selectTotal;

export const selectSelectedUserId = createSelector(
  selectUserState,
  (state: UserState) => state.selectedUserId
);

export const selectSelectedUser = createSelector(
  selectUserEntities,
  selectSelectedUserId,
  (userEntities, selectedUserId) => (selectedUserId ? userEntities[selectedUserId] ?? null : null) // Explicitly return null if not found
);


