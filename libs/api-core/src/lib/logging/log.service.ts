import { Injectable, LoggerService } from '@nestjs/common';
import * as pino from 'pino';
import * as appInsights from 'applicationinsights';

@Injectable()
export class LogService implements LoggerService {
  private logger: pino.Logger;
  private appInsightsClient: appInsights.TelemetryClient;
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.logger = pino({
        prettyPrint: { colorize: true }
      });
    } else {
      this.logger = pino();
    }
    if (appInsights?.defaultClient) {
      this.appInsightsClient = appInsights.defaultClient;
    }
  }

  static trace(message, context?: any) {
    console.log(message, context);
  }
  
  static prettyPrint(output: any) {
    console.log(JSON.stringify(output, null, '  '));
  }


  async onModuleInit() {
    this.info('LogService Initialize', '[LogService]');
  }

  error(message: string, trace: string) {
    this.logger.error(message, { stack: trace });
  }
  
  exception(err: any, message?: string) {
    if (this.appInsightsClient) {
      this.appInsightsClient.trackException({ exception: err });
    }
    this.logger.error(message, err);
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, context);
  }

  trace(message, context?: any) {
    console.log(message, context);
  }

  log(message, context?: string) {
    this.logger.info(message, { context: context });
  }

  logObject(object: any, message: string, context?: string) {
    this.logger.info(object, message, { context: context });
  }

  logQuery = message => {
    this.logger.info(message, '[Query Engine]');
  };

  info(message: any, context: string) {
    this.logger.info(message, { context: context });
  }
}
