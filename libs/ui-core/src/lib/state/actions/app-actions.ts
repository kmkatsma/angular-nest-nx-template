import { createAction, props } from '@ngrx/store';
import { EntityRequest, RequestContext } from '@ocw/shared-models';

export const appStateGet = createAction(
  'State Get',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
export const appStateSet = createAction(
  'State Save',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
export const appStateNew = createAction(
  'State New',
  props<{ requestContext: RequestContext; payload: EntityRequest }>()
);
