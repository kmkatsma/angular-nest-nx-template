import {
  BaseResponse,
  RequestContext,
  EntityRequest
} from '@ocw/shared-models';
import { createAction, props } from '@ngrx/store';

export const domainsLoad = createAction(
  'Load Domains',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
export const domainsLoadSuccess = createAction(
  'Success Domains',
  props<{ requestContext: RequestContext; payload: BaseResponse }>()
);
export const domainsLoadFailure = createAction(
  'Failure Domains',
  props<{ requestContext: RequestContext; payload: BaseResponse }>()
);
export const domainsSet = createAction(
  'Set Domains',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
