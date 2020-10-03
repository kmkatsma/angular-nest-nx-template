import {
  EntityRequest,
  BaseResponse,
  RequestContext,
  IdRequest
} from '@ocw/shared-models';
import { ResponseStatus } from '@ocw/shared-models';
import { createAction, props } from '@ngrx/store';

export const resourceClearAction = createAction(
  'Resource Clear',
  props<{}>()
);
export const resourceEditAction = createAction(
  'Resource Edit',
  props<{ requestContext: RequestContext, payload: EntityRequest }>()
);
export const resourceGetAction = createAction(
  'Resource Get',
  props<{ requestContext: RequestContext, payload: IdRequest }>()
);
export const resourceGetPostAction = createAction(
  'Resource Get Post',
  props<{ requestContext: RequestContext, payload: EntityRequest }>()
);
export const resourceGetSuccessAction = createAction(
  'Resource Get Success',
  props<{ requestContext: RequestContext, payload: BaseResponse }>()
);
export const resourceGetFailureAction = createAction(
  'Resource Get Failure',
  props<{ requestContext: RequestContext, payload: ResponseStatus }>()
);
export const resourceSaveAction = createAction(
  'Resource Save',
  props<{ requestContext: RequestContext, payload: EntityRequest }>()
);
export const resourceSaveAndNewAction = createAction(
  'Resource Save And New',
  props<{ requestContext: RequestContext, payload: EntityRequest }>()
);
export const resourceSaveSuccessAction = createAction(
  'Resource Save Success',
  props<{ requestContext: RequestContext, payload: BaseResponse }>()
);
export const resourceSaveFailureAction = createAction(
  'Resource Save Failure',
  props<{ requestContext: RequestContext, payload: ResponseStatus }>()
);
export const resourceNewAction = createAction(
  'Resource New',
  props<{ requestContext: RequestContext, payload: EntityRequest }>()
);
export const resourceNewSuccessAction = createAction(
  'Resource New Success',
  props<{ requestContext: RequestContext }>()
);
export const resourceDeleteAction = createAction(
  'Resource Delete',
  props<{ requestContext: RequestContext, payload: IdRequest }>()
);
export const resourceDeleteSuccessAction = createAction(
  'Resource Delete Success',
  props<{ requestContext: RequestContext, payload: BaseResponse }>()
);
export const resourceDeleteFailureAction = createAction(
  'Resource Delete Failure',
  props<{ requestContext: RequestContext, payload: ResponseStatus }>()
);
