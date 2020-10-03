import { createAction, props } from '@ngrx/store';
import { StatusPayload } from '../../models/status-messages';

export const statusFailureAction = createAction(
  'Failure',
  props<StatusPayload>()
);

export const statusSuccessAction = createAction(
  'Success',
  props<StatusPayload>()
);
export const statusClearAction = createAction('Clear', props<any>());
