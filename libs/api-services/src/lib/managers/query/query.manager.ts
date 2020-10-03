import { Injectable } from '@nestjs/common';
import {
  AccessContextFactory,
  ExceptionUtil,
  ServiceRegistry,
  BaseManager
} from '@ocw/api-core';
import { BaseDocument, RequestAction } from '@ocw/shared-models';
import {
  PartnerDocument,
  PartnerSearchRequest,
  PartnerYearDocument,
  PartnerYearSearchRequest,
  SavePartnerRequest,
  PartnerMessages
} from '@ocw/shared-models';
import { PartnerAccess, PartnerYearAccess } from '@ocw/api-access';

/*@Injectable()
export class QueryManager extends BaseManager {
  constructor(
    private readonly partnerAccess: PartnerAccess,
    private readonly partnerYearAccess: PartnerYearAccess,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly serviceRegistry: ServiceRegistry
  ) {
  }

  /*[PartnerMessages.Query] = async (
    request: PartnerSearchRequest
  ): Promise<PartnerDocument[]> => {
    return await this.partnerAccess.search(
      request,
      this.accessContextFactory.getAccessContext()
    );
  };*/
//}
