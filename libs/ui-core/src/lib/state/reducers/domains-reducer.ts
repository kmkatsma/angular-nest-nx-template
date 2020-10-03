import { createReducer, on } from '@ngrx/store';
import {
  ReferenceItem,
  ReferenceItemAttribute,
  ResponseStatus
} from '@ocw/shared-models';
import * as DomainActions from '../actions/domains-actions';
import { DomainsSlice, DomainsState } from './reducer-model';
import { generateNewState } from './reducer-util';
import { ReferenceDataUtil } from '../../util/reference-data-util';

export const initialSliceState: DomainsSlice = {
  results: undefined,
  responseStatus: undefined,
  resultsMap: undefined,
  lastAction: undefined
};

export const initialState: DomainsState = {
  data: Array.apply(null, Array(200)).map(function() {
    return initialSliceState;
  })
};

function createDomainSlice(
  responseStatus: ResponseStatus,
  data: ReferenceItem[],
  action: string
): DomainsSlice {
  const domainsSlice: DomainsSlice = {
    results: undefined,
    resultsMap: new Map<string, Map<string | number, ReferenceItem>>(),
    responseStatus: responseStatus,
    lastAction: action
  };

  if (data && data.length) {
    const domainGroup = {};
    const domainGroupMap = new Map<
      string,
      Map<string | number, ReferenceItem>
    >();
    let domainTypeMap = new Map<string | number, ReferenceItem>();
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        const entry: ReferenceItem = data[i];
        domainTypeMap = domainGroupMap.get(
          entry[ReferenceItemAttribute.referenceType]
        );
        if (!domainTypeMap) {
          domainTypeMap = new Map<string | number, ReferenceItem>();
          domainGroupMap.set(entry.referenceType, domainTypeMap);
          domainGroup[entry.referenceType] = [];
        }
        domainGroup[entry.referenceType].push(entry);
        if (entry.referenceType.endsWith('Document')) {
          domainTypeMap.set(entry['id'], entry);
        } else {
          domainTypeMap.set(entry['uid'], entry);
        }
        ReferenceDataUtil.addReferenceItem(entry.referenceType, entry);
      }
    }
    domainsSlice.results = domainGroup;
    domainsSlice.resultsMap = domainGroupMap;
  }
  return domainsSlice;
}

export const domainsReducer = createReducer(
  initialState,
  on(DomainActions.domainsLoad, (state, action) => {
    const domainState: DomainsSlice = Object.assign({}, initialSliceState);
    const newState = generateNewState(
      state,
      domainState,
      action.requestContext.stateIndex
    );
    return newState;
  }),
  on(DomainActions.domainsLoadSuccess, (state, action) => {
    const domainState = createDomainSlice(
      action.payload.responseStatus,
      action.payload.data,
      action.type
    );
    const newState = generateNewState(
      state,
      domainState,
      action.requestContext.stateIndex
    );
    return newState;
  }),
  on(DomainActions.domainsLoadFailure, (state, action) => {
    const domainState: DomainsSlice = {
      results: undefined,
      responseStatus: action.payload.responseStatus,
      resultsMap: undefined,
      lastAction: action.type
    };
    const newState = generateNewState(
      state,
      domainState,
      action.requestContext.stateIndex
    );
    return newState;
  }),
  on(DomainActions.domainsSet, (state, action) => {
    const domainState: DomainsSlice = {
      results: action.payload.data,
      responseStatus: undefined,
      resultsMap: undefined,
      lastAction: action.type
    };
    const newState = generateNewState(
      state,
      domainState,
      action.requestContext.stateIndex
    );
    return newState;
  })
);
