import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AccessContextFactory,
  AuditEventAccess,
  AuthUserGuard,
  LogService
} from '@ocw/api-core';
import {
  AuditEventMessages,
  AuditEventSearchRequest,
  ServiceRequest
} from '@ocw/shared-models';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class AuditEventManager {
  constructor(
    private readonly auditEventAccess: AuditEventAccess,
    private readonly logService: LogService,
    private readonly accessContextFactory: AccessContextFactory
  ) {}

  @Post([AuditEventMessages.Query])
  async [AuditEventMessages.Query](
    @Body() request: ServiceRequest<AuditEventSearchRequest>
  ) {
    this.logService.log(request, '[AuditEventMessages.Query] Request');

    return await this.auditEventAccess.search(
      request.data,
      this.accessContextFactory.getAccessContext()
    );
  }
}
