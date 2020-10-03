import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ServiceRequest } from '@ocw/shared-models';
import { AuthUserGuard } from '../auth/auth-user.guard';
import { LogService } from '../logging/log.service';
import { ServiceRegistry } from '../services/service-registry.service';

@Controller('download')
@UseGuards(AuthGuard(), AuthUserGuard)
export class DownloadController {
  constructor(
    private readonly serviceRegistry: ServiceRegistry,
    private readonly logService: LogService
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async downloadFile(@Body() serviceRequest: ServiceRequest<any>) {
    this.logService.log(
      'request:' + JSON.stringify(serviceRequest),
      '[DownloadController Controller]'
    );

    await this.serviceRegistry.execute(serviceRequest);
  }
}
