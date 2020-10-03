import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  GetReferenceDataRequest,
  RequestAction,
  EntityRequest,
  RequestContext,
} from '@ocw/shared-models';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import * as GlobalReducer from '../reducers/global-reducer';
import {
  domainsLoad,
  domainsSet,
  domainsLoadFailure,
} from '../actions/domains-actions';
import { BaseStoreService } from './base-store.service';
import { ResourceTypeEnum } from '../global.config';
import { LogService } from '../../logging/log.service';

/**************************************************** */
// Wrapper service of the Domain State in the Store
/**************************************************** */
@Injectable({
  providedIn: 'root',
})
export class DomainStoreService extends BaseStoreService {
  constructor(
    private logService: LogService,
    private store: Store<GlobalReducer.GlobalState>
  ) {
    super();
  }

  Domain$(domainEnum: number): Observable<any> {
    this.logService.log(this.getClassName() + ':Domain$', domainEnum);
    const getDomains = (globalState: GlobalReducer.GlobalState) =>
      globalState.fullDomainState.data[domainEnum].results;
    return this.store.select(getDomains).pipe(filter((p) => p !== undefined));
  }

  DomainMap$(domainEnum: number): Observable<Map<string | number, any>> {
    this.logService.log(this.getClassName() + ':Domain$', domainEnum);
    const getDomains = (globalState: GlobalReducer.GlobalState) =>
      globalState.fullDomainState.data[domainEnum].resultsMap;
    return this.store.select(getDomains).pipe(filter((p) => p !== undefined));
  }

  DomainGetFail$(domainEnum: number): Observable<any> {
    this.logService.log(this.getClassName() + ':Domain$', domainEnum);
    const getDomains = (globalState: GlobalReducer.GlobalState) =>
      globalState.fullDomainState.data[domainEnum]?.lastAction;
    return this.store.select(getDomains).pipe(
      filter((p) => p !== undefined),
      filter((p) => p === domainsLoadFailure.type)
    );
  }

  /***********************************************************************************/
  /* Checks store if domains loaded and if not loaded, trigger effect to load via API
   ************************************************************************************/
  loadDomains(
    domainEnum: number,
    domainKey: string,
    messageType: string,
    options?: { noCache?: boolean }
  ): void {
    if (options && options.noCache) {
      this.executeRequest(domainEnum, domainKey, messageType);
      return;
    }
    let state: any;
    this.logService.log(
      this.getClassName() + ':start loadDomains domainEnum',
      domainEnum
    );
    const getDomains = (globalState: GlobalReducer.GlobalState) =>
      globalState.fullDomainState.data[domainEnum]?.results;
    this.store
      .select(getDomains)
      .pipe(take(1))
      .subscribe((s) => (state = s));
    if (!state) {
      this.executeRequest(domainEnum, domainKey, messageType);
    } else {
      this.logService.debug(this.getClassName() + ':domains already loaded');
    }
  }

  executeRequest(
    domainEnum: number,
    domainKey: string,
    messageType: string
  ): void {
    if (!domainKey) {
      domainKey = 'None';
    }
    const requestContext = new RequestContext(
      domainEnum,
      ResourceTypeEnum.Domain,
      messageType
    );

    const requestMessage: GetReferenceDataRequest = {
      messageType: messageType,
      data: domainKey,
      action: RequestAction.Get,
    };
    const request = new EntityRequest(requestMessage);

    this.logService.log(
      this.getClassName() + ':start executeGetRequest:',
      request.data
    );
    this.store.dispatch(
      domainsLoad({ requestContext: requestContext, payload: request })
    );
  }

  loadAsDomain(domainEnum: number, messageType: string): void {
    const domainKey = 'None';
    const requestContext = new RequestContext(
      domainEnum,
      ResourceTypeEnum.Domain,
      messageType
    );

    const requestMessage: GetReferenceDataRequest = {
      messageType: messageType,
      data: domainKey,
      action: RequestAction.Get,
    };
    const request = new EntityRequest(requestMessage);

    this.logService.debug(
      this.getClassName() + ':start executeGetRequest:',
      request.data
    );
    this.store.dispatch(
      domainsLoad({ requestContext: requestContext, payload: request })
    );
  }

  setDomainState(data: any, domainEnum: number): void {
    const requestContext = new RequestContext(
      domainEnum,
      ResourceTypeEnum.Domain,
      undefined
    );
    const request = new EntityRequest(data);
    this.logService.debug(this.getClassName() + ':start setDomainState:', data);
    this.store.dispatch(
      domainsSet({ requestContext: requestContext, payload: request })
    );
  }
}
