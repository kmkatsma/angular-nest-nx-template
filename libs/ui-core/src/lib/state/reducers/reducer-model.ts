import { ResponseStatus } from '@ocw/shared-models';
import { ReferenceItem } from '@ocw/shared-models';

export class BaseState {
  data: any[];
}

export class BaseSlice {
  responseStatus: ResponseStatus;
}

export interface DomainsState extends BaseState {
  data: DomainsSlice[];
}

export interface AppState extends BaseState {
  data: AppSlice[];
}

export interface AppExtensionState extends BaseState {
  data: AppSlice[];
}

export interface ActionState extends BaseState {
  data: ActionSlice[];
}

export interface ResourceState extends BaseState {
  data: ResourceSlice[];
}

export interface SearchState extends BaseState {
  data: SearchSlice[];
}

export interface DomainsSlice extends BaseSlice {
  results: any;
  resultsMap: Map<string, Map<string | number, ReferenceItem>>;
  lastAction: string;
}

export interface AppSlice extends BaseSlice {
  results: any;
  new: boolean;
}

export interface ActionSlice extends BaseSlice {
  results: any;
}

export interface ResourceSlice extends BaseSlice {
  results: any;
  loading: boolean;
  new: boolean;
  saved: boolean;
  lastAction: string;
}

export interface SearchSlice extends BaseSlice {
  results: any[];
  selected: any[];
  loading: boolean;
  loaded: boolean;
}
