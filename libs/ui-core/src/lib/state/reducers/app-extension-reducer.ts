import { AppSlice, AppState } from './reducer-model';
import { generateNewState } from './reducer-util';
import * as AppExtensionActions from '../actions/app-extension-actions';
import { createReducer, on } from '@ngrx/store';
import { CloneUtil } from '@ocw/shared-core';
 
export const initialSliceState: AppSlice = {
  results: undefined,
  new: false,
  responseStatus: undefined
};

export const initialState: AppState = {
  data: []
};

export const appExtensionStateReducer = createReducer(
  initialState,
  on(AppExtensionActions.appExtensionStateGet, (state, action) => { 
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
  on(AppExtensionActions.appExtensionStateSet, (state, action) => { 
    const resourceSlice: AppSlice = {
      results: action.payload.data,
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
  on(AppExtensionActions.appExtensionStateNew, (state, action) => { 
    const resourceSlice: AppSlice = {
      results: CloneUtil.cloneDeep(action.payload.data),
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


