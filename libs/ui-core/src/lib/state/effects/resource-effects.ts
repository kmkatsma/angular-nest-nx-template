import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of as observableOf } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  resourceDeleteAction,
  resourceDeleteFailureAction,
  resourceDeleteSuccessAction,
  resourceGetAction,
  resourceGetFailureAction,
  resourceGetPostAction,
  resourceGetSuccessAction,
  resourceNewAction,
  resourceNewSuccessAction,
  resourceSaveAction,
  resourceSaveFailureAction,
  resourceSaveSuccessAction,
} from '../actions/resource-actions';
import { BaseEffect } from './base-effect';
import { EffectsService, EffectType } from './effects-utils';
import { BaseDataService } from '../../http/base-data.service';

@Injectable()
export class ResourceEffects extends BaseEffect {
  new$ = createEffect(() =>
    this.action$.pipe(
      ofType(resourceNewAction),
      mergeMap((action) =>
        observableOf(true).pipe(
          map((res) => {
            return resourceNewSuccessAction({
              requestContext: action.requestContext,
            });
          })
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.action$.pipe(
      ofType(resourceDeleteAction),
      mergeMap((action) =>
        this.dataService.delete(action.payload, action.requestContext.url).pipe(
          catchError((err) =>
            this.effectsService.handleError(
              err,
              action.requestContext,
              'Delete Failed'
            )
          ),
          map((res) =>
            this.effectsService.handleResponse(res, action.requestContext, {
              errorAction: resourceDeleteFailureAction({
                requestContext: action.requestContext,
                payload: res.responseStatus,
              }),
              successAction: resourceDeleteSuccessAction({
                requestContext: action.requestContext,
                payload: res,
              }),
              type: EffectType.Delete,
            })
          )
        )
      )
    )
  );

  get$ = createEffect(() =>
    this.action$.pipe(
      ofType(resourceGetAction),
      mergeMap((action) =>
        this.dataService.get(action.payload, action.requestContext.url).pipe(
          catchError((err) =>
            this.effectsService.handleError(
              err,
              action.requestContext,
              'Error Retrieving Data'
            )
          ),
          map((res) =>
            this.effectsService.handleResponse(res, action.requestContext, {
              errorAction: resourceGetFailureAction({
                requestContext: action.requestContext,
                payload: res.responseStatus,
              }),
              successAction: resourceGetSuccessAction({
                requestContext: action.requestContext,
                payload: res,
              }),
              type: EffectType.Get,
            })
          )
        )
      )
    )
  );

  getPost$ = createEffect(() =>
    this.action$.pipe(
      ofType(resourceGetPostAction),
      mergeMap((action) =>
        this.dataService.post(action.payload, action.requestContext.url).pipe(
          catchError((err) =>
            this.effectsService.handleError(
              err,
              action.requestContext,
              'Error Retrieving Data'
            )
          ),
          map((res) =>
            this.effectsService.handleResponse(res, action.requestContext, {
              errorAction: resourceGetFailureAction({
                requestContext: action.requestContext,
                payload: res.responseStatus,
              }),
              successAction: resourceGetSuccessAction({
                requestContext: action.requestContext,
                payload: res,
              }),
              type: EffectType.Get,
            })
          )
        )
      )
    )
  );

  save$ = createEffect(() =>
    this.action$.pipe(
      ofType(resourceSaveAction),
      mergeMap((action) =>
        this.dataService.post(action.payload, action.requestContext.url).pipe(
          catchError((err) =>
            this.effectsService.handleError(
              err,
              action.requestContext,
              'Request Failed'
            )
          ),
          map((res) =>
            this.effectsService.handleResponse(res, action.requestContext, {
              errorAction: resourceSaveFailureAction({
                requestContext: action.requestContext,
                payload: res.responseStatus,
              }),
              successAction: resourceSaveSuccessAction({
                requestContext: action.requestContext,
                payload: res,
              }),
              type: EffectType.Save,
            })
          )
        )
      )
    )
  );

  /*saveAndNew$ = createEffect(() =>
    this.action$.pipe(
      ofType(resourceSaveAndNewAction),
      switchMap(action =>
        this.dataService.post(action.payload, action.requestContext.url).pipe(
          catchError(err =>
            this.effectsService.handleError(
              err,
              action.requestContext,
              'Request Failed'
            )
          ),
          map(res => 

            this.effectsService.handleResponse(res, action.requestContext, {
              errorAction: resourceSaveFailureAction({
                requestContext: action.requestContext,
                payload: res.responseStatus
              }),
              successAction: resourceSaveSuccessAction({
                requestContext: action.requestContext,
                payload: res
              }),
              type: EffectType.Save
            }) 
          )
        )
      )
    )
  );*/

  constructor(
    private action$: Actions,
    private dataService: BaseDataService,
    private effectsService: EffectsService
  ) {
    super();
  }
}
