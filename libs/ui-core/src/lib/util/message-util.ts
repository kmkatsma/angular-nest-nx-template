import { ServiceRequest, RequestAction } from '@ocw/shared-models';

export class MessageUtil {
  static create<T>(
    messageType: string,
    data: T,
    action: RequestAction
  ): ServiceRequest<T> {
    const serviceRequest = new ServiceRequest<T>();
    serviceRequest.messageType = messageType;
    serviceRequest.data = data;
    serviceRequest.action = action;
    console.log('create request', serviceRequest, messageType, data, action);
    return serviceRequest;
  }
}
