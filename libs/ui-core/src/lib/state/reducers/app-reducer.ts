import { AppSlice, AppState } from './reducer-model';
import { generateNewState } from './reducer-util';
import * as AppActions from '../actions/app-actions';
import { createReducer, on } from '@ngrx/store';
import { CloneUtil } from '@ocw/shared-core';
 
export const initialSliceState: AppSlice = {
  results: undefined,
  new: false,
  responseStatus: undefined
};

export const initialState: AppState = {
  data: Array.apply(null, Array(200)).map(function () {})
};

export const appStateReducer = createReducer(
  initialState,
  on(AppActions.appStateGet, (state, action) => { 
    const existingResults =
        state.data[action.requestContext.stateIndex]?.results;
      const resourceSlice: AppSlice = CloneUtil.cloneDeep( {
        results: existingResults,
        new: false, 
        responseStatus: undefined
      });
      const newState = generateNewState(
        state,
        resourceSlice,
        action.requestContext.stateIndex
      );
      return newState;
  }),
  on(AppActions.appStateSet, (state, action) => { 
    const resourceSlice: AppSlice = {
      results: action.payload,
      new: false,
      responseStatus: undefined
    };
    const newState = generateNewState(
      state,
      resourceSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),  
  on(AppActions.appStateNew, (state, action) => { 
    const resourceSlice: AppSlice = {
      results: CloneUtil.cloneDeep(action.payload),
      new: true,
      responseStatus: undefined
    };
    const newState = generateNewState(
      state,
      resourceSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),    
);


