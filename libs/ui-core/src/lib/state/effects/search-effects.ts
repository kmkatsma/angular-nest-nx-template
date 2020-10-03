import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  BaseResponse,
  RequestContext,
  BaseAppStateEnum,
} from '@ocw/shared-models';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BaseEffect } from './base-effect';
import {
  searchStartAction,
  searchAction,
  searchGetAction,
  searchFailAction,
  searchSuccessAction,
} from '../actions/search-actions';
import { EffectType, EffectsService } from './effects-utils';
import { SearchStoreService } from '../store-services/search-store-service';
import { LogService } from '../../logging/log.service';
import { BaseDataService } from '../../http/base-data.service';
import { AppStoreService } from '../store-services/app-store.service';

@Injectable()
export class SearchEffects extends BaseEffect {
  new$ = createEffect(() =>
    this.action$.pipe(
      ofType(searchStartAction),
      mergeMap((action) =>
        this.searchStoreService
          .SearchLoading$(action.requestContext.stateIndex)
          .pipe(
            map((res) => {
              this.logService.log('is searching', res);
              if (!res) {
                this.appStoreService.setState(true, BaseAppStateEnum.Searching);
                this.logService.log('dispatch search', action.payload);
                return searchAction({
                  requestContext: action.requestContext,
                  payload: action.payload,
                });
              }
            })
          )
      )
    )
  );

  search$ = createEffect(() =>
    this.action$.pipe(
      ofType(searchAction),
      mergeMap((action) =>
        this.dataService.search(action.payload, action.requestContext.url).pipe(
          catchError((err) =>
            this.effectsService.handleError(
              err,
              action.requestContext,
              'Error in Search'
            )
          ),
          map((res) => this.handleSearchResponse(res, action.requestContext))
        )
      )
    )
  );

  get$ = createEffect(() =>
    this.action$.pipe(
      ofType(searchGetAction),
      mergeMap((action) =>
        this.dataService.get(action.payload, action.requestContext.url).pipe(
          catchError((err) =>
            this.effectsService.handleError(
              err,
              action.requestContext,
              'Error in Search'
            )
          ),
          map((res) => this.handleSearchResponse(res, action.requestContext))
        )
      )
    )
  );

  handleSearchResponse(res: BaseResponse, requestContext: RequestContext) {
    this.appStoreService.setState(false, BaseAppStateEnum.Searching);
    return this.effectsService.handleResponse(res, requestContext, {
      errorAction: searchFailAction({
        requestContext: requestContext,
        payload: res.responseStatus,
      }),
      successAction: searchSuccessAction({
        requestContext: requestContext,
        payload: res,
      }),
      type: EffectType.Search,
    });
  }

  constructor(
    private action$: Actions,
    private dataService: BaseDataService,
    private logService: LogService,
    private searchStoreService: SearchStoreService,
    private appStoreService: AppStoreService,
    private effectsService: EffectsService
  ) {
    super();
  }
}
