import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { plainToClassFromExist, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { LogService } from '../logging/log.service';

export class ValidationUtil {
  static async validate<T>(typeInstance: T, request: T) {
    LogService.trace('[ValidationUtil.validate]:', [typeInstance, request]);
    const validationResult = await validate(
      plainToClassFromExist(typeInstance, request)
    );
    if (validationResult.length > 0) {
      throw new BadRequestException(validationResult);
    }
    return request;
  }
}
