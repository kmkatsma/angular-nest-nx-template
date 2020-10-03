import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RequestContext } from '@ocw/shared-models';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ResourceTypeEnum } from '../global.config';
import * as GlobalReducer from '../reducers/global-reducer';
import { BaseStoreService } from './base-store.service';
import { appExtensionStateSet } from '../actions/app-extension-actions';
import { LogService } from '../../logging/log.service';
import { UiCoreModule } from '../../ui-core.module';

// Wrapper service of the State in the Store
@Injectable({
  providedIn: 'root'
})
export class AppExtensionStoreService extends BaseStoreService {
  constructor(
    private logService: LogService,
    private store: Store<GlobalReducer.GlobalState>,
  ) {
    super();
  }

  AppExtensionState$(stateEnum: number): Observable<any> {
    this.logService.log(this.getClassName() + ':AppState$');
    const getState = (globalState: GlobalReducer.GlobalState) =>
      globalState.appExtensionState.data[stateEnum]?.results;
    return this.store.select(getState).pipe(filter(p => p !== undefined));
  }

  setState(state: any, stateEnum: number): void {
    const requestContext = new RequestContext(
      stateEnum,
      ResourceTypeEnum.AppExtension, undefined
    );
    this.logService.log(this.getClassName() + ':start setState:', state);
    this.store.dispatch(
      appExtensionStateSet({ requestContext: requestContext, payload: state })
    );
  }
  
}
