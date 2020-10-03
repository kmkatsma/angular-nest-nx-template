import { ActionReducerMap, Action } from '@ngrx/store';
import * as StatusReducer from './status-reducer';
import * as ResourceReducer from './resource-reducer';
import * as DomainsReducer from './domains-reducer';
import * as SearchReducer from './search-reducer';
import * as AppReducer from './app-reducer';
import {
  DomainsState,
  ResourceState,
  SearchState,
  AppState,
} from './reducer-model';
import { appExtensionStateReducer } from './app-extension-reducer';

export const LOGOUT = ':Logout';

export class LogoutAction implements Action {
  readonly type = LOGOUT;
  constructor() {}
}

export function logout(reducer) {
  return function(state, action) {
    return reducer(action.type === LOGOUT ? undefined : state, action);
  };
}

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface GlobalState {
  fullDomainState: DomainsState;
  statusState: StatusReducer.State;
  resourceState: ResourceState;
  searchState: SearchState;
  appState: AppState;
  appExtensionState: AppState;
  // TODO add other States here
}

/* Names of reducers must match names of GlobalState above! */
export const reducers: ActionReducerMap<GlobalState> = {
  fullDomainState: DomainsReducer.domainsReducer,
  statusState: StatusReducer.statusReducer,
  resourceState: ResourceReducer.resourceReducer,
  searchState: SearchReducer.searchReducer,
  appState: AppReducer.appStateReducer,
  appExtensionState: appExtensionStateReducer,
  // TODO add other reducers here
};
