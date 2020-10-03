import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import {
  BaseAppStateEnum,
  BaseResponse,
  RequestContext,
  ResponseStatus,
} from '@ocw/shared-models';
import { of as observableOf } from 'rxjs';
import { LogService } from '../../logging/log.service';
import {
  StatusPayloadUtil,
  SystemMessageType,
} from '../../models/status-messages';
import {
  statusFailureAction,
  statusSuccessAction,
} from '../actions/status-actions';
import { GlobalState } from '../reducers/global-reducer';
import { AppStoreService } from '../store-services/app-store.service';
import { BaseStoreService } from '../store-services/base-store.service';

export enum EffectType {
  Get = 1,
  Save = 2,
  Delete = 3,
  Search = 4,
}

export class ActionWrapper {
  successAction: Action;
  errorAction: Action;
  type: EffectType;
}

@Injectable()
export class EffectsService extends BaseStoreService {
  constructor(
    protected logService: LogService,
    private store: Store<GlobalState>,
    private appStoreService: AppStoreService
  ) {
    super();
  }

  handleError(err: any, requestContext: RequestContext, message: string) {
    this.appStoreService.setState(false, BaseAppStateEnum.Searching);
    console.log('handle error');
    this.logService.error(
      this.getClassName() + ':effectsService handleError ',
      err
    );
    const errorResponse = this.handleResponseError(
      err,
      requestContext,
      message
    );
    /*this.store.dispatch(statusFailureAction(
      StatusPayloadUtil.createFailureStatusPayload(errorResponse, requestContext, SystemMessageType.Validation )
    ));*/
    return observableOf(errorResponse);
  }

  handleResponse(
    res: BaseResponse,
    requestContext: RequestContext,
    actionWrapper: ActionWrapper
  ) {
    this.logService.log(this.getClassName() + ':post$ success', res);
    this.logService.log(
      this.getClassName() + ':post$ success state:',
      requestContext.stateIndex
    );
    if (res.responseStatus.statusCode !== 0) {
      this.store.dispatch(actionWrapper.errorAction);
      if (res.responseStatus.statusCode === 409) {
        return statusFailureAction(
          StatusPayloadUtil.createFailureStatusPayload(
            res,
            requestContext,
            SystemMessageType.Validation
          )
        );
      }
      return statusFailureAction(
        StatusPayloadUtil.createFailureStatusPayload(
          res,
          requestContext,
          SystemMessageType.Error
        )
      );
    } else {
      if (
        actionWrapper.type === EffectType.Delete ||
        actionWrapper.type === EffectType.Save
      ) {
        this.store.dispatch(actionWrapper.successAction);
        return statusSuccessAction(
          StatusPayloadUtil.createSuccessStatusPayload(
            res,
            requestContext,
            SystemMessageType.Information
          )
        );
      }
      if (
        actionWrapper.type === EffectType.Get ||
        actionWrapper.type === EffectType.Search
      ) {
        return actionWrapper.successAction;
      }
    }
  }

  handleResponseError(
    err: HttpErrorResponse,
    requestContext: RequestContext,
    message: string
  ): BaseResponse {
    let responseBody: any;
    const status = this.createResponseStatusFromContext(requestContext);
    status.statusCode = 500;
    status.errorEnumId = 1;
    if (err) {
      responseBody = err.error;
    }
    if (responseBody?.responseInfo) {
      status.errors = responseBody.responseInfo.errors;
    }
    if (responseBody?.responseInfo?.message) {
      status.message = responseBody.responseInfo.message;
    } else {
      status.message = message;
    }
    const errorResponse = new BaseResponse(status);
    return errorResponse;
  }

  createResponseStatus(): ResponseStatus {
    const responseStatus = new ResponseStatus();
    responseStatus.statusCode = 0;
    return responseStatus;
  }

  createResponseStatusFromContext(
    requestContext: RequestContext
  ): ResponseStatus {
    const responseStatus = new ResponseStatus();
    responseStatus.statusCode = 0;
    responseStatus.message = requestContext.successMessage;
    return responseStatus;
  }
}
