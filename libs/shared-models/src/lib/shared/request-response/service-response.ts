import { RequestAction } from './request-action';
import { IsDefined } from 'class-validator';

// Requests
export class RequestContext {
  public stateIndex: number;
  public resourceType: number;
  public successMessage: string;
  public failureMessage: string;
  public successUrl: string;
  public url: string;
  constructor(index: number, resource: number, messageType: string) {
    this.stateIndex = index;
    this.resourceType = resource;
    this.url = 'resources/' + messageType;
  }
}

export class ActionRequest {
  public ActionRequestPropertyFlag = true;
}

export class BaseFilter {}

export class IdRequest {
  constructor(public id: string | number) {}
}

export class EntityRequest {
  constructor(public data: any) {}
}

export class EntityListRequest {
  constructor(public data: any[]) {}
}

// Response
export class ResponseError {
  public errorCode: number;
  public fieldName: string;
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class ResponseStatus {
  public errorEnumId: number;
  public statusCode: number;
  public message: string;
  public stackTrace: string;
  public errors: ResponseError[];
  constructor() {
    this.statusCode = 0;
  }
}

export class BaseResponse {
  public data: any;
  constructor(public responseStatus: ResponseStatus) {}
}

export class ServiceResponse<T> extends BaseResponse {
  public data: T;

  constructor(data?: T) {
    super(new ResponseStatus());
    this.data = data;
    this.responseStatus.message = '';
    this.responseStatus.statusCode = 0;
    this.responseStatus.errorEnumId = 0;
    this.responseStatus.errors = [];
  }
}

export enum ServiceTypeEnum {
  Action = 1,
  Upload = 2,
  Resource = 3,
  Search = 4,
  Domain = 5,
}

export interface IServiceResponse {
  statusMessage: string;
  data: any;
}

export class ResourceResponse implements IServiceResponse {
  statusMessage: string;
  data: any;
}

export class ServiceRequest<T> {
  @IsDefined()
  messageType: string;
  action: RequestAction;
  @IsDefined()
  data: T;
}
