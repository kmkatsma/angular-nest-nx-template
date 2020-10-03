import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
 import { catchError, map, mergeMap } from 'rxjs/operators';
import { BaseEffect } from './base-effect';
import { domainsLoad, domainsLoadFailure, domainsLoadSuccess } from '../actions/domains-actions';
 
import { EffectsService, EffectType } from './effects-utils';
import { BaseDataService } from '../../http/base-data.service';
import { LogService } from '../../logging/log.service';
 

@Injectable()
export class DomainEffects extends BaseEffect {
  domain$ = createEffect(() =>
    this.action$.pipe(
      ofType(domainsLoad),
      mergeMap(action =>
        this.dataService.post(action.payload, action.requestContext.url).pipe(
          catchError(err =>
            this.effectsService.handleError(
              err,
              action.requestContext,
              'Domain Load Failed'
            )
          ),
          map(res =>
            this.effectsService.handleResponse(res, action.requestContext, {
              errorAction: domainsLoadFailure({
                requestContext: action.requestContext,
                payload: res
              }),
              successAction: domainsLoadSuccess({
                requestContext: action.requestContext,
                payload: res
              }),
              type: EffectType.Get
            })
          )
        )
      )
    )
  );

  constructor(
    private action$: Actions,
    private dataService: BaseDataService,
    private logService: LogService,
    private effectsService: EffectsService
  ) {
    super();
  }
}
