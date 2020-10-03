import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RequestContext } from '@ocw/shared-models';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as GlobalReducer from '../reducers/global-reducer';
import { DomainStoreService } from './domain-store.service';
import { ResourceStoreService } from './resource-store-service';
import { SearchStoreService } from './search-store-service';
import { appStateSet } from '../actions/app-actions';
import { searchClearAction } from '../actions/search-actions';
import { resourceClearAction } from '../actions/resource-actions';
import { BaseStoreService } from './base-store.service';
import { ResourceTypeEnum } from '../global.config';
import { LogService } from '../../logging/log.service';

// Wrapper service of the State in the Store
@Injectable({
  providedIn: 'root',
})
export class AppStoreService extends BaseStoreService {
  constructor(
    private logService: LogService,
    private store: Store<GlobalReducer.GlobalState>,
    public resource: ResourceStoreService,
    public domain: DomainStoreService,
    public search: SearchStoreService
  ) {
    super();
  }

  AppState$(appStateEnum: number): Observable<any> {
    this.logService.log(this.getClassName() + ':AppState$');
    const getState = (globalState: GlobalReducer.GlobalState) =>
      globalState.appState.data[appStateEnum]?.results;
    return this.store.select(getState).pipe(filter((p) => p !== undefined));
  }

  clearState() {
    this.store.dispatch(searchClearAction({}));
    this.store.dispatch(resourceClearAction({}));
  }

  setState(state: any, appStateEnum: number): void {
    const requestContext = new RequestContext(
      appStateEnum,
      ResourceTypeEnum.App,
      undefined
    );
    this.logService.log(this.getClassName() + ':start setState:', state);
    this.store.dispatch(
      appStateSet({ requestContext: requestContext, payload: state })
    );
  }

  /*newState(appStateEnum: AppStateEnum): void {
    this.logService.log(this.getClassName() + ':dispatch NewAction');
    this.store.dispatch(
      new AppActions.NewAction(this.app.getNewState(appStateEnum))
    );
  }*/

  logout() {
    this.store.dispatch(new GlobalReducer.LogoutAction());
  }
}
