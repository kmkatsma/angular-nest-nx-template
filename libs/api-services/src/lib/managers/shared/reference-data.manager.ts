import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
  UseGuards,
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { DomainsAccess } from '@ocw/api-access';
import {
  AccessContextFactory,
  BaseManager,
  GenericAccessUtil,
  LogService,
  ReferenceDataAccess,
  ReferenceDataTableConfig,
  ServiceRegistry,
  ValidationUtil,
  ReferenceDataTableColumns,
  AuthUserGuard,
} from '@ocw/api-core';
import {
  GetReferenceDataRequest,
  ReferenceDataMessages,
  ReferenceItem,
  RequestAction,
  SaveReferenceDataRequest,
} from '@ocw/shared-models';
import { ModelValidationEngine } from '../../engines/shared/model-validation-engine';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class ReferenceDataManager {
  constructor(
    private readonly domainAccess: DomainsAccess,
    private readonly logService: LogService,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly referenceDataAccess: ReferenceDataAccess,
    private readonly modelValidationEngine: ModelValidationEngine
  ) {}

  @Post([ReferenceDataMessages.Mutate])
  async [ReferenceDataMessages.Mutate](
    @Body() request: SaveReferenceDataRequest
  ) {
    this.logService.log(
      [ReferenceDataMessages.Mutate],
      '[ReferenceDataManager.Mutate]'
    );
    this.logService.log(request, '[ReferenceDataManager.Mutate] Request');
    const accessContext = this.accessContextFactory.getAccessContext();

    await ValidationUtil.validate(new SaveReferenceDataRequest(), request);
    await this.modelValidationEngine.validateReferenceData(
      request.referenceAttribute,
      request.data
    );

    const currentDomains: ReferenceItem[] = await this.domainAccess.getDomainsAttributeList(
      request.domainKey,
      request.referenceAttribute
    );
    this.referenceDataAccess.clearCache(
      request.domainKey,
      request.referenceAttribute
    );
    if (request.action === RequestAction.Create) {
      request.data.id = undefined;
      if (currentDomains.length > 0) {
        request.data.uid =
          Math.max.apply(
            Math,
            currentDomains.map(function (o) {
              return o.uid;
            })
          ) + 1;
      } else {
        request.data.uid = 1;
      }
      return GenericAccessUtil.add(
        accessContext,
        request.data,
        ReferenceDataTableConfig,
        {
          [ReferenceDataTableColumns.reference_type]:
            request.data.referenceType,
          [ReferenceDataTableColumns.reference_group]:
            request.data.referenceGroup,
        }
      );
    }
    if (request.action === RequestAction.Update) {
      return GenericAccessUtil.update(
        accessContext,
        request.data,
        ReferenceDataTableConfig,
        {}
      );
    }
    throw new BadRequestException('Invalid Action');
  }

  @Post([ReferenceDataMessages.Read])
  async [ReferenceDataMessages.Read](@Body() request: GetReferenceDataRequest) {
    this.logService.log(
      [ReferenceDataMessages.Read],
      '[ReferenceDataManager.Read]'
    );
    this.logService.log(request, '[ReferenceDataManager.Read] Request');
    //request = await this.validateGet(request);
    const currentDomains: ReferenceItem[] = await this.referenceDataAccess.loadReferenceDataGroup(
      request.data
    );
    return currentDomains;
  }
}
