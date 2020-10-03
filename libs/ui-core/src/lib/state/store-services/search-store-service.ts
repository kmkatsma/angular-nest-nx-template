import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  BaseFilter,
  BaseResponse,
  EntityRequest,
  RequestAction,
  RequestContext,
  ResponseStatus,
  IdRequest
} from '@ocw/shared-models';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as SearchActions from '../actions/search-actions';
import { GlobalState } from '../reducers/global-reducer';
import { BaseStoreService } from './base-store.service';
import { ResourceTypeEnum,  } from '../global.config';
import { LogService } from '../../logging/log.service';
import { MessageUtil } from '../../util/message-util';
import { UiCoreModule } from '../../ui-core.module';

// Wrapper service of the State in the Store
@Injectable({
  providedIn: 'root'
})
export class SearchStoreService extends BaseStoreService {
  constructor(
    private logService: LogService,
    private store: Store<GlobalState>
  ) {
    super();
  }

  Searche$(searchEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Searche$:' + searchEnum);
    const getSearch = (globalState: GlobalState) =>
      globalState.searchState.data[searchEnum]?.results;
    return this.store.select(getSearch).pipe(filter(p => p !== undefined));
  }

  SearchLoaded$(searchEnum: number): Observable<boolean> {
    this.logService.debug(this.getClassName() + ':SearchLoaded$:' + searchEnum);
    const getSearch = (globalState: GlobalState) =>
      globalState.searchState.data[searchEnum]?.loaded;
    return this.store.select(getSearch);
  }

  SearchLoading$(searchEnum: number): Observable<boolean> {
    this.logService.debug(
      this.getClassName() + ':SearchLoading$:' + searchEnum
    );
    const getSearch = (globalState: GlobalState) =>
      globalState.searchState.data[searchEnum]?.loading;
    return this.store.select(getSearch);
  }

  setSearchData(data: any, searchEnum: number): void {
    const requestContext = new RequestContext(
      searchEnum,
      ResourceTypeEnum.Search, undefined
    );
    const responseStatus = new ResponseStatus();
    const response = new BaseResponse(responseStatus);
    response.data = data;

    this.store.dispatch(
      SearchActions.searchUpdateAction({
        requestContext: requestContext,
        payload: response
      })
    );
  }

  processMessage<T>(data: T, searchEnum: number, messageType: string,): void {
    const sourceRequest = MessageUtil.create(
      messageType,
      data,
      RequestAction.Get
    );
    this.logService.log('request:', sourceRequest, searchEnum);
    const requestContext = new RequestContext(
      searchEnum,
      ResourceTypeEnum.Search, messageType,
    );
    const request = Object.assign({}, sourceRequest);
    const payload = new EntityRequest(sourceRequest);
    payload.data = request;
    this.logService.log(this.getClassName() + ':start search:' + searchEnum);
    this.SearchLoading$(searchEnum)
      .pipe(take(1))
      .subscribe(isSearching => {
        if (isSearching) {
          this.logService.log(
            this.getClassName() + ':already searching:' + searchEnum
          );
          return;
        } else {
          this.store.dispatch(
            SearchActions.searchAction({
              requestContext: requestContext,
              payload: payload
            })
          );
        }
      });
  }

  /*search(sourceRequest: BaseFilter, searchEnum: string): void {
    const requestContext = new RequestContext(
      searchEnum,
      ResourceTypeEnum.Search
    );
    this.logService.log('request:', sourceRequest, searchEnum);
    const request = Object.assign({}, sourceRequest);
    const payload = new EntityRequest(request);
    this.logService.log(this.getClassName() + ':start search:' + searchEnum);
    this.SearchLoading$(searchEnum)
      .pipe(take(1))
      .subscribe(isSearching => {
        if (isSearching) {
          this.logService.log(
            this.getClassName() + ':already searching:' + searchEnum
          );
          return;
        } else {
          this.store.dispatch(
            SearchActions.searchAction({
              requestContext: requestContext,
              payload: payload
            })
          );
        }
      });
  }

  get(request: string, searchEnum: string): void {
    const requestContext = new RequestContext(
      searchEnum,
      ResourceTypeEnum.Search
    );
    const payload = new IdRequest(request);
    this.logService.debug(this.getClassName() + ':start search:' + searchEnum);

    this.SearchLoading$(searchEnum)
      .pipe(take(1))
      .subscribe(isSearching => {
        if (isSearching) {
          this.logService.log(
            this.getClassName() + ':already searching:' + searchEnum
          );
          return;
        } else {
          this.store.dispatch(
            SearchActions.searchGetAction({
              requestContext: requestContext,
              payload: payload
            })
          );
        }
      });
  }*/
}
