import { createReducer, on } from '@ngrx/store';
import * as ResourceActions from '../actions/resource-actions';
import { ResourceSlice, ResourceState } from './reducer-model';
import { generateNewState } from './reducer-util';
import { CloneUtil } from '@ocw/shared-core';

export const initialSliceState: ResourceSlice = {
  results: undefined,
  loading: false,
  new: false,
  saved: false,
  lastAction: undefined,
  responseStatus: undefined
}; 

export const initialState: ResourceState = {
  data: Array.apply(null, Array(1000)).map(function () {return initialSliceState;})
};

export const resourceReducer = createReducer(
  initialState,
  on(ResourceActions.resourceClearAction, (state, action) => { 
    return CloneUtil.cloneDeep(initialState);
  }),
  on(ResourceActions.resourceEditAction, (state, action) => { 
    const resourceSlice: ResourceSlice = Object.assign(
      {},
      initialSliceState,
      {
        results: action.payload.data,
        loading: false,
        new: false,
        saved: false,
        lastAction: action.type
      }
    );
    const newState = generateNewState(
      state,
      resourceSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),  
  on(ResourceActions.resourceGetAction, ResourceActions.resourceGetPostAction, (state, action) => { 
      const resourceSlice: ResourceSlice = Object.assign(
        {},
        initialSliceState,
        {
          loading: true,
          new: false,
          saved: false,
          lastAction: action.type
        }
      );
      const newState = generateNewState(
        state,
        resourceSlice,
        action.requestContext.stateIndex
      );
      return newState;
  }),    
  on(ResourceActions.resourceGetSuccessAction, (state, action) => { 
    const resourceSlice: ResourceSlice = {
      results: action.payload.data,
      loading: false,
      new: false,
      saved: false,
      lastAction: action.type,
      responseStatus: undefined
    };
    const newState = generateNewState(
      state,
      resourceSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),      
  on(ResourceActions.resourceGetFailureAction, (state, action) => { 
    const resourceSlice: ResourceSlice = {
      results: undefined,
      loading: false,
      new: false,
      saved: false,
      lastAction: action.type,
      responseStatus: action.payload
    };
    const newState = generateNewState(
      state,
      resourceSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),    
  on(ResourceActions.resourceSaveAction, ResourceActions.resourceSaveAndNewAction,(state, action) => { 
    const existingResults =
    state.data[action.requestContext.stateIndex]?.results;
  const resourceSlice: ResourceSlice = Object.assign(
    {},
    initialSliceState,
    {
      loading: true,
      results: existingResults,
      new: false,
      saved: false,
      lastAction: action.type
    }
  );
  const newState = generateNewState(
    state,
    resourceSlice,
    action.requestContext.stateIndex
  );
  return newState;
  }),    
  on(ResourceActions.resourceSaveSuccessAction,(state, action) => { 
    const resourceSlice: ResourceSlice = Object.assign(
      {},
      initialSliceState,
      {
        results: action.payload.data,
        loading: false,
        new: false,
        saved: true,
        lastAction: action.type
      }
    );
    const newState = generateNewState(
      state,
      resourceSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }), 
  on(ResourceActions.resourceSaveFailureAction,(state, action) => { 
    const existingResults =
    state.data[action.requestContext.stateIndex]?.results;
  const resourceSlice: ResourceSlice = Object.assign(
    {},
    initialSliceState,
    {
      results: existingResults,
      loading: false,
      saved: false,
      responseStatus: action.payload
    }
  );
  const newState = generateNewState(
    state,
    resourceSlice,
    action.requestContext.stateIndex
  );
  return newState;
  }),       
  on(ResourceActions.resourceDeleteAction,(state, action) => { 
    const existingResults =
    state.data[action.requestContext.stateIndex]?.results;
  const resourceSlice: ResourceSlice = Object.assign(
    {},
    initialSliceState,
    {
      loading: true,
      results: existingResults,
      new: false,
      saved: false,
      lastAction: action.type
    }
  );
  const newState = generateNewState(
    state,
    resourceSlice,
    action.requestContext.stateIndex
  );
  return newState;
  }),   
  on(ResourceActions.resourceDeleteSuccessAction,(state, action) => { 
    const resourceSlice: ResourceSlice = {
      results: undefined,
      loading: false,
      new: false,
      saved: false,
      lastAction: action.type,
      responseStatus: undefined
    };
    const newState = generateNewState(
      state,
      resourceSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),   
  on(ResourceActions.resourceDeleteFailureAction,(state, action) => { 
    const existingResults =
        state.data[action.requestContext.stateIndex]?.results;
      const resourceSlice: ResourceSlice = {
        results: existingResults,
        loading: false,
        new: false,
        saved: false,
        lastAction: action.type,
        responseStatus: action.payload
      };
      const newState = generateNewState(
        state,
        resourceSlice,
        action.requestContext.stateIndex
      );
      return newState;
  }),   
  on(ResourceActions.resourceNewAction,(state, action) => { 
    const resourceSlice: ResourceSlice = {
      results: action.payload.data,
      loading: false,
      new: true,
      saved: false,
      lastAction: action.type,
      responseStatus: undefined
    };
    const newState = generateNewState(
      state,
      resourceSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),   
  on(ResourceActions.resourceNewSuccessAction,(state, action) => { 
    const existingResults =
        state.data[action.requestContext.stateIndex]?.results;
      const resourceSlice: ResourceSlice = {
        results: existingResults,
        loading: false,
        new: true,
        saved: false,
        lastAction: action.type,
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
  