import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { LogService } from '../logging/log.service';
import { DateUtil } from '@ocw/shared-core';
import {
  ValidationError,
  ResponseError,
  ResponseStatus,
} from '@ocw/shared-models';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  parseValidation(errors: ValidationError[], messages: ResponseError[]) {
    errors.forEach((error) => {
      if (error.constraints) {
        Object.keys(error.constraints).forEach((key) => {
          messages.push(new ResponseError(error.constraints[key]));
        });
      } else if (error.children) {
        this.parseValidation(error.children, messages);
      } else {
        messages.push(new ResponseError((error as unknown) as string));
      }
    });
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const date = DateUtil.getGMTTimestamp();

    if (!exception.getStatus) {
      this.logService.exception('exception', exception);
      const rs = new ResponseStatus();
      rs.message = 'Unknown exception';
      rs.statusCode = 500;
      rs.errorEnumId = 0;

      response.status(500).json({
        responseInfo: rs,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        timestampNum: date,
      });
      return;
    } else {
      const status = exception.getStatus();
      const messages = new Array<ResponseError>();
      if (exception.response && Array.isArray(exception.response.message)) {
        this.logService.exception(exception.response);
        this.parseValidation(exception.response.message, messages);
        this.logService.log(messages, '[ExceptionFilter.catch: Messages]');
      } else {
        if (exception.message) {
          this.logService.exception(
            JSON.stringify(exception.message),
            exception
          );
        } else {
          this.logService.exception(exception, exception);
        }
      }

      const responseStatus = new ResponseStatus();
      responseStatus.message = exception.message;
      responseStatus.statusCode = status;
      responseStatus.errorEnumId = 0;
      responseStatus.errors = messages;

      response.status(status).json({
        responseInfo: responseStatus,
        responseStatus: responseStatus,
        statusCode: status,
        timestamp: new Date().toISOString(),
        timestampNum: date,
      });
    }
  }
}
