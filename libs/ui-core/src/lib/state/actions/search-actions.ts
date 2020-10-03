import { createAction, props } from '@ngrx/store';
import {
  EntityRequest,
  BaseResponse,
  ResponseStatus,
  RequestContext,
  IdRequest
} from '@ocw/shared-models';

export const searchAction = createAction(
  'Search',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
export const searchStartAction = createAction(
  'Start Search',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
export const searchGetAction = createAction(
  'Search Get',
  props<{ requestContext: RequestContext; payload: IdRequest }>()
);
export const searchSuccessAction = createAction(
  'Search Success',
  props<{ requestContext: RequestContext; payload: BaseResponse }>()
);
export const searchFailAction = createAction(
  'Search Failure',
  props<{ requestContext: RequestContext; payload: ResponseStatus }>()
);
export const searchUpdateAction = createAction(
  'Search Update',
  props<{ requestContext: RequestContext; payload: BaseResponse }>()
);
export const searchClearAction = createAction('Search Clear', props<{}>());
/*export const SearchUpdateSuccessAction = createAction(
  'Search Update Success',
  props<{requestContext: RequestContext,payload: BaseResponse}>()
);*/
/*export const SearchLoadingAction = createAction(
  'Search Loading',
  props<{ requestContext: RequestContext}>()
);
export const SearchLoadedAction = createAction(
  'Search Loaded',
  props<{requestContext: RequestContext}>()
);
export const SearchSelectedAction = createAction(
  'Search Selected',
  props<{requestContext: RequestContext, payload: EntityListRequest}>()
);*/
