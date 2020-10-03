import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AccessContextFactory,
  AuthUserGuard,
  LogService,
  RequestContext,
  TenantAccess,
  UserAccess,
  UserMaintenanceAuth0Access,
} from '@ocw/api-core';
import {
  RequestAction,
  SaveUserInfoRequest,
  ServiceRequest,
  TenantDocument,
  TenantMessages,
  UserInfoSearchRequest,
  UserMessageTypes,
} from '@ocw/shared-models';
import { AppService } from './app.service';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userAccess: UserAccess,
    private readonly userMaintenanceAccess: UserMaintenanceAuth0Access,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly tenantAccess: TenantAccess,
    private readonly logService: LogService
  ) {}

  @Post([UserMessageTypes.UserGetCurrent])
  async [UserMessageTypes.UserGetCurrent]() {
    const currentUser = RequestContext.currentUser();

    if (!currentUser) {
      throw new Error('current user not set');
    }
    return await this.userAccess.getByUserId(
      currentUser.userId,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([UserMessageTypes.Query])
  async [UserMessageTypes.Query](@Body() request: UserInfoSearchRequest) {
    const currentUser = RequestContext.currentUser();

    if (!currentUser) {
      throw new Error('current user not set');
    }
    return await this.userAccess.getListForTenant(
      request.data.tenantId,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([UserMessageTypes.Mutate])
  async [UserMessageTypes.Mutate](@Body() request: SaveUserInfoRequest) {
    const currentUser = RequestContext.currentUser();

    if (!currentUser) {
      throw new Error('current user not set');
    }
    if (request.action === RequestAction.Create) {
      return await this.userMaintenanceAccess.add(
        request.data.emailAddress,
        request.data,
        this.accessContextFactory.getAccessContext()
      );
    }
    if (request.action === RequestAction.Update) {
      return await this.userMaintenanceAccess.update(
        request.data,
        this.accessContextFactory.getAccessContext()
      );
    }
  }

  @Post([TenantMessages.GetAll])
  async [TenantMessages.GetAll]() {
    const currentUser = RequestContext.currentUser();

    if (!currentUser) {
      throw new Error('current user not set');
    }
    return await this.tenantAccess.getList(
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([TenantMessages.Mutate])
  async [TenantMessages.Mutate](
    @Body() request: ServiceRequest<TenantDocument>
  ) {
    const currentUser = RequestContext.currentUser();
    console.log('request', request);
    if (!currentUser) {
      throw new Error('current user not set');
    }
    if (request.data.id) {
      return await this.tenantAccess.update(
        request.data,
        this.accessContextFactory.getAccessContext()
      );
    } else {
      return await this.tenantAccess.add(
        request.data,
        this.accessContextFactory.getAccessContext()
      );
    }
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
