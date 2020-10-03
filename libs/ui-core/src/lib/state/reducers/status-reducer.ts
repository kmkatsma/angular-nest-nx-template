import { createReducer, on } from '@ngrx/store';
import { StatusPayload } from '@ocw/ui-core';
import * as StatusActions from '../actions/status-actions';

export interface State {
  status: StatusPayload;
}

export const initialState: State = {
  status: undefined
};

// Define State Selector for convenience
export const responseStatus = (state: State) => state.status;

export const statusReducer = createReducer(
  initialState,
  on(StatusActions.statusFailureAction, (state, action) => {
    const newState: State = {
      status: action
    };
    return newState;
  }),
  on(StatusActions.statusSuccessAction, (state, action) => {
    const newState: State = {
      status: action
    };
    return newState;
  }),
  on(StatusActions.statusClearAction, (state, action) => {
    return initialState;
  })
);
