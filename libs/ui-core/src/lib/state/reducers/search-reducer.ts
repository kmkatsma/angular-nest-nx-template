import { createReducer, on } from '@ngrx/store';
import * as SearchActions from '../actions/search-actions';
import { SearchSlice, SearchState } from './reducer-model';
import { generateNewState } from './reducer-util';

export const initialSliceState: SearchSlice = {
  results: undefined,
  selected: undefined,
  loading: false,
  loaded: false,
  responseStatus: undefined
};

export const initialState: SearchState = {
  data: Array.apply(null, Array(200)).map(function() {
    return initialSliceState;
  })
};

export const searchReducer = createReducer(
  initialState,
  on(SearchActions.searchStartAction, (state, action) => {
    return state;
  }),
  on(SearchActions.searchAction, (state, action) => {
    const searchSlice: SearchSlice = Object.assign({}, initialSliceState, {
      loading: true
    });
    const newState = generateNewState(
      state,
      searchSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),
  on(SearchActions.searchSuccessAction, (state, action) => {
    const searchSlice: SearchSlice = {
      results: action.payload.data,
      selected: undefined,
      loading: false,
      loaded: true,
      responseStatus: action.payload.responseStatus
    };
    const newState = generateNewState(
      state,
      searchSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),
  on(SearchActions.searchFailAction, (state, action) => {
    const searchSlice: SearchSlice = {
      results: undefined,
      selected: undefined,
      loading: false,
      loaded: false,
      responseStatus: action.payload
    };
    const newState = generateNewState(
      state,
      searchSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),
  /*on(SearchActions.SearchSelectedAction, (state, action) => {
    const searchSlice = Object.assign({}, initialSliceState, {
      selected: action.payload
    });
    const newState = generateNewState(
      state,
      searchSlice,
      action.requestContext.stateIndex
    );
    return newState;
  }),*/
  on(SearchActions.searchUpdateAction, (state, action) => {
    const searchSlice = Object.assign({}, initialSliceState, {
      results: action.payload.data
    });
    return generateNewState(
      state,
      searchSlice,
      action.requestContext.stateIndex
    );
  }),
  on(SearchActions.searchClearAction, (state, action) => {
    return initialState;
  })
);
