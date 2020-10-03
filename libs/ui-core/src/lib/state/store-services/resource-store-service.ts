import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  BaseResponse,
  EntityRequest,
  RequestAction,
  RequestContext,
  ResponseStatus,
  ServiceRequest,
} from '@ocw/shared-models';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LogService } from '../../logging/log.service';
import * as ResourceActions from '../actions/resource-actions';
import { ResourceTypeEnum } from '../global.config';
import * as GlobalReducer from '../reducers/global-reducer';
import { BaseStoreService } from './base-store.service';

export enum RequestType {
  Save = 1,
  Get = 2,
}

// Wrapper service of the State in the Store
@Injectable({
  providedIn: 'root',
})
export class ResourceStoreService extends BaseStoreService {
  constructor(
    private logService: LogService,
    private store: Store<GlobalReducer.GlobalState>
  ) {
    super();
  }

  ResourceLoading$(resourceEnum: number): Observable<boolean> {
    this.logService.debug(this.getClassName() + ':Resource$', resourceEnum);
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum]?.loading;
    return this.store.select(getResource);
  }

  Resource$(resourceEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Resource$', resourceEnum);
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum].results;
    return this.store.select(getResource).pipe(filter((p) => p !== undefined));
  }

  NullableResource$(resourceEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Resource$', resourceEnum);
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum]?.results;
    return this.store.select(getResource);
  }

  ResourceSave$(resourceEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Resource$');
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum]?.lastAction;
    return this.store.select(getResource).pipe(
      filter((p) => p !== undefined),
      filter((p) => p === ResourceActions.resourceSaveSuccessAction.type)
    );
  }

  ResourceChange$(resourceEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Resource$');
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum]?.lastAction;
    return this.store.select(getResource).pipe(
      filter((p) => p !== undefined),
      filter(
        (p) =>
          p === ResourceActions.resourceDeleteSuccessAction.type ||
          p === ResourceActions.resourceSaveSuccessAction.type
      )
    );
  }

  ResourceDelete$(resourceEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Resource$');
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum]?.lastAction;
    return this.store.select(getResource).pipe(
      filter((p) => p !== undefined),
      filter((p) => p === ResourceActions.resourceDeleteSuccessAction.type)
    );
  }

  ResourceNew$(resourceEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Resource$');
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum]?.lastAction;
    return this.store.select(getResource).pipe(
      filter((p) => p !== undefined),
      filter((p) => p === ResourceActions.resourceNewAction.type)
    );
  }

  ResourceGet$(resourceEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Resource$');
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum]?.lastAction;
    return this.store.select(getResource).pipe(
      filter((p) => p !== undefined),
      filter((p) => p === ResourceActions.resourceGetSuccessAction.type)
    );
  }

  ResourceGetFail$(resourceEnum: number): Observable<any> {
    this.logService.debug(this.getClassName() + ':Resource$');
    const getResource = (globalState: GlobalReducer.GlobalState) =>
      globalState.resourceState.data[resourceEnum]?.lastAction;
    return this.store.select(getResource).pipe(
      filter((p) => p !== undefined),
      filter((p) => p === ResourceActions.resourceGetFailureAction.type)
    );
  }

  executeServiceRequest(
    serviceRequest: ServiceRequest<any>,
    resourceEnum: number,
    successMessage?: string
  ) {
    const request = new EntityRequest(serviceRequest);
    const requestContext = new RequestContext(
      resourceEnum,
      ResourceTypeEnum.Resource,
      serviceRequest.messageType
    );
    requestContext.successMessage = successMessage
      ? successMessage
      : 'Action completed';
    this.logService.log(
      this.getClassName() + ':start executeServiceRequest:',
      request
    );
    this.store.dispatch(
      ResourceActions.resourceSaveAction({
        requestContext: requestContext,
        payload: request,
      })
    );
  }

  executeService(options: {
    data: any;
    messageType: string;
    resourceEnum: number;
    successMessage?: string;
    action?: RequestAction;
    hideMessage?: boolean;
  }): void {
    const serviceRequest = new ServiceRequest();
    serviceRequest.data = options.data;
    serviceRequest.action = options.action;
    serviceRequest.messageType = options.messageType;
    const request = new EntityRequest(serviceRequest);
    const requestContext = new RequestContext(
      options.resourceEnum,
      ResourceTypeEnum.Resource,
      options.messageType
    );
    if (!options.hideMessage) {
      requestContext.successMessage = options.successMessage
        ? options.successMessage
        : 'Action completed';
    }
    this.logService.log(
      this.getClassName() + ':start executeServiceRequest:',
      request
    );
    this.store.dispatch(
      ResourceActions.resourceSaveAction({
        requestContext: requestContext,
        payload: request,
      })
    );
  }

  executeGetServiceRequest(
    serviceRequest: ServiceRequest<any>,
    resourceEnum: number,
    successMessage?: string
  ) {
    const request = new EntityRequest(serviceRequest);
    const requestContext = new RequestContext(
      resourceEnum,
      ResourceTypeEnum.Resource,
      serviceRequest.messageType
    );
    requestContext.successMessage = undefined;
    this.logService.log(
      this.getClassName() + ':start executeGetServiceRequest:',
      request
    );
    this.store.dispatch(
      ResourceActions.resourceGetPostAction({
        requestContext: requestContext,
        payload: request,
      })
    );
  }

  executeGetRequest(
    id: string | number,
    resourceEnum: number,
    messageType: string
  ): void {
    const requestContext = new RequestContext(
      resourceEnum,
      ResourceTypeEnum.Resource,
      messageType
    );
    const requestMessage: ServiceRequest<string | number> = {
      messageType: messageType,
      data: id,
      action: RequestAction.Get,
    };
    const request = new EntityRequest(requestMessage);
    this.logService.log(
      this.getClassName() + ':start executeGetRequest:',
      request.data
    );
    this.store.dispatch(
      ResourceActions.resourceGetPostAction({
        requestContext: requestContext,
        payload: request,
      })
    );
  }

  /*saveResourceWithAction(
    resource: BaseDocument,
    returnResource: ResourceEnum,
    actionResource: ResourceEnum,
    successMessage = 'Resource Saved'
  ): void {
    const request = new EntityRequest(resource);
      returnResource,
      ResourceTypeEnum.Resource
    );
    request.data = resource;
    request.requestContext.successMessage = successMessage;
    this.logService.log(
      this.getClassName() + ':start saveResource:',
      request.data
    );
    this.store.dispatch(ResourceActions.resourceSaveAction(request));
  }*/

  clearResourceData(): void {
    this.store.dispatch(ResourceActions.resourceClearAction({}));
  }

  clearResourceDataSlot(slot: number): void {
    this.store.dispatch(ResourceActions.resourceClearAction({}));
  }

  setResourceData(data: any, resourceEnum: number): void {
    const requestContext = new RequestContext(
      resourceEnum,
      ResourceTypeEnum.Resource,
      undefined
    );
    const responseStatus = new ResponseStatus();
    const actionPayload = new BaseResponse(responseStatus);
    actionPayload.data = data;
    this.store.dispatch(
      ResourceActions.resourceGetSuccessAction({
        requestContext: requestContext,
        payload: actionPayload,
      })
    );
  }

  /*saveAndClearResource(resource: any, resourceEnum: number): void {
    const requestContext = new RequestContext(
      resourceEnum,
      ResourceTypeEnum.Resource
    );
    const request = new EntityRequest(resource);
    requestContext.successMessage = 'Resource saved';
    this.logService.log(
      this.getClassName() + ':start saveAndClearResource:',
      request
    );
    this.store.dispatch(
      ResourceActions.resourceSaveAndNewAction({
        requestContext: requestContext,
        payload: request
      })
    );
  }*/

  newResource(resourceEnum: number, data: any): void {
    const requestContext = new RequestContext(
      resourceEnum,
      ResourceTypeEnum.Resource,
      undefined
    );
    this.logService.debug(this.getClassName() + ':dispatch NewAction');
    const request = new EntityRequest(data);
    this.store.dispatch(
      ResourceActions.resourceNewAction({
        requestContext: requestContext,
        payload: request,
      })
    );
  }

  /*deleteResource(id: string, resourceEnum: string): void {
    const requestContext = new RequestContext(
      resourceEnum,
      ResourceTypeEnum.Resource, undefined,
    );
    const request = new IdRequest(id);
    request.id = id;
    requestContext.successMessage = 'Resource Deleted';
    this.logService.debug(this.getClassName() + ':dispatch DeleteAction');
    this.store.dispatch(
      ResourceActions.resourceDeleteAction({
        requestContext: requestContext,
        payload: request
      })
    );
  }*/
}
