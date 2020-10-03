import {
  BadRequestException,
  Injectable,
  Controller,
  UseGuards,
  Post,
  Body
} from '@nestjs/common';
import { AttributeValueAccess } from '@ocw/api-access';
import {
  AccessContextFactory,
  BaseManager,
  LogService,
  ServiceRegistry,
  AuthUserGuard
} from '@ocw/api-core';
import {
  AttributeValueMessages,
  AttributeValueSearchRequest,
  SaveAttributeRequest,
  ServiceRequest
} from '@ocw/shared-models';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class AttributeValueManager extends BaseManager {
  constructor(
    private readonly attributeValueAccess: AttributeValueAccess,
    private readonly logService: LogService,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly serviceRegistry: ServiceRegistry
  ) {
    super('AttributeValueManager', AttributeValueMessages, serviceRegistry);
  }

  @Post([AttributeValueMessages.Mutate])
  async [AttributeValueMessages.Mutate](
    @Body() request: SaveAttributeRequest<any>
  ) {
    this.logService.log(request, '[AttributeValueMessages.Mutate] Request');
    //request = await this.validate(plainToClass(SaveAttributeRequest, request));

    return await this.attributeValueAccess.addOrReplace(
      request.data,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([AttributeValueMessages.Query])
  async [AttributeValueMessages.Query](
    @Body() request: ServiceRequest<AttributeValueSearchRequest>
  ) {
    this.logService.log(request, '[AttributeValueMessages.Query] Request');
    //const searchRequest = await this.validate(
    //  plainToClass(AttributeValueSearchRequest, request.data)
    //);
    return await this.attributeValueAccess.search(
      request.data,
      this.accessContextFactory.getAccessContext()
    );
  }

  private async validate<T>(request: T) {
    const validationResult = await validate(request);
    if (validationResult.length > 0) {
      throw new BadRequestException(validationResult);
    }
    return request;
  }
}
