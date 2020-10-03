import {
  ResponseError,
  RequestContext,
  BaseResponse
} from '@ocw/shared-models';

export enum SystemMessageType {
  Error = 1,
  Information = 2,
  Validation = 3
}

export class StatusPayload {
  constructor(
    public errors: ResponseError[],
    public message: string,
    public messageType: SystemMessageType
  ) {}
}

export class StatusPayloadUtil {
  static createFailureStatusPayload(
    response: BaseResponse,
    requestContext: RequestContext,
    messageType: SystemMessageType
  ) {
    return new StatusPayload(
      response.responseStatus.errors,
      requestContext.failureMessage
        ? requestContext.failureMessage
        : response.responseStatus.message,
      messageType
    );
  }

  static createSuccessStatusPayload(
    response: BaseResponse,
    requestContext: RequestContext,
    messageType: SystemMessageType
  ) {
    return new StatusPayload(
      null,
      requestContext.successMessage
        ? requestContext.successMessage
        : response.responseStatus.message,
      messageType
    );
  }
}
