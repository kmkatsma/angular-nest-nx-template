import { Injectable, UseGuards, Controller, Post, Body } from '@nestjs/common';
import {
  AccessContextFactory,
  ExceptionUtil,
  ServiceRegistry,
  BaseManager,
  ValidationUtil,
  AuthUserGuard,
} from '@ocw/api-core';
import {
  BaseDocument,
  RequestAction,
  ServiceRequest,
  ClonePartnerYearRequest,
} from '@ocw/shared-models';
import {
  PartnerDocument,
  PartnerSearchRequest,
  PartnerYearDocument,
  PartnerYearSearchRequest,
  PartnerMessages,
} from '@ocw/shared-models';
import { PartnerAccess, PartnerYearAccess } from '@ocw/api-access';
import { AuthGuard } from '@nestjs/passport';
import { PartnerValidationEngine } from '../../engines/shared/partner-validation.engine';
import { CloneUtil } from '@ocw/shared-core';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class PartnerManager extends BaseManager {
  constructor(
    private readonly partnerAccess: PartnerAccess,
    private readonly partnerYearAccess: PartnerYearAccess,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly serviceRegistry: ServiceRegistry,
    private readonly validationEngine: PartnerValidationEngine
  ) {
    super('PartnerManager', PartnerMessages, serviceRegistry);
  }

  @Post([PartnerMessages.Read])
  async [PartnerMessages.Read](
    @Body() request: ServiceRequest<string>
  ): Promise<PartnerDocument> {
    return await this.partnerAccess.get(
      request.data,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([PartnerMessages.Mutate])
  async [PartnerMessages.Mutate](
    @Body() request: ServiceRequest<PartnerDocument>
  ): Promise<PartnerDocument> {
    const accessContext = this.accessContextFactory.getAccessContext();
    let savedPartner: PartnerDocument;

    try {
      await accessContext.beginTransaction();

      if (request.action === RequestAction.Update) {
        savedPartner = await this.partnerAccess.update(
          request.data,
          accessContext
        );
      }
      if (request.action === RequestAction.Create) {
        savedPartner = await this.partnerAccess.add(
          request.data,
          this.accessContextFactory.getAccessContext()
        );
      }
      if (request.action === RequestAction.Delete) {
        savedPartner = await this.partnerAccess.delete(
          request.data,
          accessContext
        );
      }

      await accessContext.commitTransaction();
      return savedPartner;
    } catch (err) {
      await accessContext.rollbackTransaction();
      ExceptionUtil.handleException(err, 'Failure trying to save user');
    }
  }

  @Post([PartnerMessages.MutateYear])
  async [PartnerMessages.MutateYear](
    @Body() request: ServiceRequest<PartnerYearDocument>
  ): Promise<PartnerYearDocument> {
    const accessContext = this.accessContextFactory.getAccessContext();

    await this.validationEngine.validatePartnerYear(request.data);

    if (request.action === RequestAction.Update) {
      return await this.partnerYearAccess.update(request.data, accessContext);
    }
    if (request.action === RequestAction.Create) {
      return await this.partnerYearAccess.add(
        request.data,
        this.accessContextFactory.getAccessContext()
      );
    }
    if (request.action === RequestAction.Delete) {
      return await this.partnerYearAccess.delete(request.data, accessContext);
    }
  }

  @Post([PartnerMessages.Query])
  async [PartnerMessages.Query](
    @Body() request: ServiceRequest<PartnerSearchRequest>
  ): Promise<PartnerDocument[]> {
    const results = await this.partnerAccess.search(
      request.data,
      this.accessContextFactory.getAccessContext()
    );
    return results;
  }

  @Post([PartnerMessages.QueryYear])
  async [PartnerMessages.QueryYear](
    @Body() request: ServiceRequest<PartnerYearSearchRequest>
  ): Promise<PartnerYearDocument[]> {
    return await this.partnerYearAccess.search(
      request.data,
      this.accessContextFactory.getAccessContext()
    );
  }

  @Post([PartnerMessages.CloneYear])
  async [PartnerMessages.CloneYear](
    @Body() request: ClonePartnerYearRequest
  ): Promise<PartnerYearDocument> {
    const sourceYear = await this.partnerYearAccess.get(
      request.data.sourcePartnerYearId,
      this.accessContextFactory.getAccessContext()
    );
    const newYear = CloneUtil.cloneDeep(sourceYear);
    newYear.id = undefined;
    newYear.startDate = request.data.startDate;

    return await this.partnerYearAccess.add(
      newYear,
      this.accessContextFactory.getAccessContext()
    );
  }
}
