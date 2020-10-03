import { Injectable, BadRequestException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ServiceRequest } from '@ocw/shared-models';
import { LogService } from '../logging/log.service';

export enum MessageCategory {
  Mutation = 1,
  Read = 2,
  Query = 3,
  Import = 4,
  Export = 5,
  Command = 6,
  Event = 7
}

export class MessageTypeInfo {
  constructor(public manager: string, public managerAction: string) {}
}

@Injectable()
export class ServiceRegistry {
  private serviceMap = new Map<string, MessageTypeInfo>();

  constructor(
    private readonly logService: LogService,
    private moduleRef: ModuleRef
  ) {
    this.logService.trace('ServiceRegistry contructed');
  }

  async execute<R>(serviceRequest: ServiceRequest<any>) {
    this.logService.log(
      serviceRequest.messageType,
      '[ServiceRegistry.execute]'
    );
    this.logService.log(this.serviceMap, 'ServiceMap');
    const messageTypeInfo = this.serviceMap.get(serviceRequest.messageType);

    const manager = this.moduleRef.get(messageTypeInfo.manager, {
      strict: false
    });
    const func = manager[messageTypeInfo.managerAction];
    if (!func) {
      throw new BadRequestException(
        'Unhandled Message Type',
        serviceRequest.messageType
      );
    }
    return (await func(serviceRequest)) as R;
  }

  register(actionName: string, serviceManager: string) {
    const messageType = new MessageTypeInfo(serviceManager, actionName);
    this.serviceMap.set(actionName, messageType);
  }
}
