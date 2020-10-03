import { createAction, props } from '@ngrx/store';
import { EntityRequest, RequestContext } from '@ocw/shared-models';

export const appExtensionStateGet = createAction(
  'Extension State Get',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
export const appExtensionStateSet = createAction(
  'Extension State Save',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
export const appExtensionStateNew = createAction(
  'Extension State New',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
