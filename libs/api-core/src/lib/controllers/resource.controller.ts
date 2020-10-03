import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  BaseDocument,
  BaseSearchResult,
  ServiceRequest,
  ServiceResponse,
} from '@ocw/shared-models';
import { AuthUserGuard } from '../auth/auth-user.guard';
import { LogService } from '../logging/log.service';
import { ServiceRegistry } from '../services/service-registry.service';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class ResourceController {
  constructor(
    private readonly logService: LogService,
    private readonly serviceRegistry: ServiceRegistry,
    private readonly moduleRef: ModuleRef
  ) {}

  @Post()
  async execute(
    @Body() serviceRequest: ServiceRequest<any>
  ): Promise<ServiceResponse<BaseDocument>> {
    this.logService.log(serviceRequest, '[ResourceController] execute');

    return new ServiceResponse<BaseDocument>(
      await this.serviceRegistry.execute(serviceRequest)
    );
  }
}
