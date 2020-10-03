import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
  InternalServerErrorException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttributeValueAccess } from '@ocw/api-access';
import { AccessContextFactory, AuthUserGuard, LogService } from '@ocw/api-core';
import {
  AddressMatch,
  AddressValidationMessages,
  ServiceRequest
} from '@ocw/shared-models';
import { AddressValidationEngine } from '../../engines/shared/address-validation-engine';

@UseGuards(AuthGuard(), AuthUserGuard)
@Controller('resources')
export class AddressManager {
  constructor(
    private readonly attributeValueAccess: AttributeValueAccess,
    private readonly logService: LogService,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly addressValidationEngine: AddressValidationEngine
  ) {}

  @Post([AddressValidationMessages.Get])
  async [AddressValidationMessages.Get](
    @Body() request: ServiceRequest<string>
  ) {
    this.logService.log(request, '[AddressValidationMessages.Get] Request');
    try {
      return await this.addressValidationEngine.getAddress(request.data);
    } catch (err) {
      if (err.code && err.code === 404) {
        throw new NotFoundException('Address Not Found');
      }
      throw err;
    }
  }

  @Post([AddressValidationMessages.Match])
  async [AddressValidationMessages.Match](
    @Body() request: ServiceRequest<string>
  ): Promise<AddressMatch[]> {
    this.logService.log(request, '[AddressValidationMessages.Match] Request');
    try {
      return await this.addressValidationEngine.getRecommendations(
        request.data
      );
    } catch (err) {
      if (err.code && err.code === 404) {
        throw new NotFoundException('Address Not Found');
      }
      throw err;
    }
  }
}
