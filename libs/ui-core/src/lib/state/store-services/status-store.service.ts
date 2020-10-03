import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as StatusActions from '../actions/status-actions';
import * as GlobalReducer from '../reducers/global-reducer';
import { BaseStoreService } from './base-store.service';
import { LogService } from '../../logging/log.service';
import { StatusPayload, SystemMessageType } from '../../models/status-messages';
import { UiCoreModule } from '../../ui-core.module';

export const VALIDATION_ERROR_MESSAGE = 'Please fix validation errors';

// Wrapper service of the Account State in the Store
@Injectable({
  providedIn: 'root'
})
export class StatusStoreService extends BaseStoreService {
  constructor(
    private logService: LogService,
    private store: Store<GlobalReducer.GlobalState>
  ) {
    super();
  }

  Status$(): Observable<StatusPayload> {
    this.logService.debug(this.getClassName() + ':Status$');
    const statusSelector = (globalState: GlobalReducer.GlobalState) =>
      globalState.statusState.status;
    return this.store.select(statusSelector);
  }

  statusComparer(p: StatusPayload, q: StatusPayload): boolean {
    /*if (p && q) {
      return p.message === q.message;
    }*/
    return false;
  }

  publishMessage(message: string) {
    this.store.dispatch(
      StatusActions.statusSuccessAction(
        new StatusPayload(null, message, SystemMessageType.Information)
      )
    );
  }

  publishError(message: string) {
    this.store.dispatch(
      StatusActions.statusFailureAction(
        new StatusPayload(null, message, SystemMessageType.Error)
      )
    );
  }

  clearMessages() {
    this.store.dispatch(StatusActions.statusClearAction(undefined));
  }
}
