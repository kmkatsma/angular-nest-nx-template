import { Injectable, BadRequestException } from '@nestjs/common';
import { LogService, ValidationUtil } from '@ocw/api-core';
import { ModelValidationConfig } from '@ocw/shared-models';

@Injectable()
export class ModelValidationEngine {
  constructor(private readonly logService: LogService) {}

  validationMap = new Map<string, ModelValidationConfig>();

  registerReferenceValidation(
    referenceType: string,
    config: ModelValidationConfig
  ) {
    this.validationMap.set(referenceType, config);
  }
  async validateReferenceData(referenceType: string, itemToValidate: any) {
    console.log('validationMap', this.validationMap);
    const validationConfig = this.validationMap.get(referenceType);
    if (!validationConfig) {
      throw new BadRequestException(
        'No validation mapped for ' + referenceType
      );
    }
    await ValidationUtil.validate(
      validationConfig.typedInstance,
      itemToValidate
    );
  }
}
