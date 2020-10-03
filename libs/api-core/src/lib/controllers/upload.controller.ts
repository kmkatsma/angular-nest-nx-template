import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ServiceResponse, ServiceRequest } from '@ocw/shared-models';
import { AuthGuard } from '@nestjs/passport';
import { AuthUserGuard } from '../auth/auth-user.guard';
import { ServiceRegistry } from '../services/service-registry.service';
import { LogService } from '../logging/log.service';

@Controller('upload')
@UseGuards(AuthGuard(), AuthUserGuard)
export class UploadController {
  constructor(
    private readonly serviceRegistry: ServiceRegistry,
    private readonly logService: LogService
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: any) {
    this.logService.log(
      'formData count:' + files.length,
      '[Upload Controller]'
    );
    if (files.length < 2) {
      throw new BadRequestException(
        'Missing Upload Data: requires messageType and file'
      );
    }
    const type = files[0].originalname;
    if (!type) {
      throw new BadRequestException('Missing Message Type');
    }

    const serviceRequest = new ServiceRequest();
    serviceRequest.messageType = type;
    serviceRequest.data = files;

    return new ServiceResponse(
      await this.serviceRegistry.execute(serviceRequest)
    );
  }
}
