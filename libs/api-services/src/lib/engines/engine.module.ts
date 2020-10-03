import { Module } from '@nestjs/common';
import { AccessModule } from '@ocw/api-access';
import { AddressValidationEngine } from './shared/address-validation-engine';
import { ModelValidationEngine } from './shared/model-validation-engine';
import { PartnerValidationEngine } from './shared/partner-validation.engine';

@Module({
  imports: [AccessModule],
  providers: [
    AddressValidationEngine,
    ModelValidationEngine,
    PartnerValidationEngine,
  ],
  exports: [
    AddressValidationEngine,
    ModelValidationEngine,
    PartnerValidationEngine,
  ],
})
export class EngineModule {}
