import { Injectable, BadRequestException } from '@nestjs/common';
import { PartnerYearAccess } from '@ocw/api-access';
import { AccessContextFactory, LogService } from '@ocw/api-core';
import {
  PartnerYearDocument,
  PartnerYearSearchRequest,
  PartnerYearDocumentField,
} from '@ocw/shared-models';

@Injectable()
export class PartnerValidationEngine {
  constructor(
    private readonly logService: LogService,
    private accessContextFactory: AccessContextFactory,
    private partnerYearAccess: PartnerYearAccess
  ) {}

  async validatePartnerYear(partnerYear: PartnerYearDocument) {
    const searchRequest = new PartnerYearSearchRequest();
    if (partnerYear.id) {
      searchRequest.idNotEqual = partnerYear.id;
    }
    searchRequest.partnerId = partnerYear.partnerId;
    searchRequest.startDt = partnerYear.startDate;

    const results = await this.partnerYearAccess.search(
      searchRequest,
      this.accessContextFactory.getAccessContext()
    );
    if (results.length > 0) {
      throw new BadRequestException('Rate Set with Start Date already exists');
    }
  }
}
