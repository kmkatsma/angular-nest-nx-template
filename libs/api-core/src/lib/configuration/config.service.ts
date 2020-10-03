import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { LogService } from '../logging/log.service';

@Injectable()
export class ConfigService {
  // private readonly envConfig: { [key: string]: string };
  public isDevelopment = false;
  public isPostgres = true;

  constructor(filePath: string, private readonly logService: LogService) {
    //this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    const configResult = dotenv.config({ path: filePath, debug: false });
    if (process.env.NODE_ENV === 'development') {
      this.isDevelopment = true;
    }
    if (process.env.DB_TYPE === 'postgres') {
      this.isPostgres = true;
    } else {
      this.isPostgres = false;
    }
    // this.logService.log('configResult' + JSON.stringify(configResult));
    this.logService.log(
      'isDevelopment: ' + this.isDevelopment,
      'ConfigService'
    );
    this.logService.log('isPostgres: ' + this.isPostgres, 'ConfigService');
    this.logService.log('DB_URL: ' + this.get('DB_URL'), 'ConfigService');
    this.logService.log('' + this.get('IDENTITY_ENDPOINT'), 'ConfigService');
    this.logService.log('NODE_ENV: ' + process.env.NODE_ENV, 'ConfigService');
    this.logService.log('SSL: ' + this.get('DB_SSL'), 'ConfigService');
  }

  onModuleInit() {}

  get(key: string): string {
    return process.env[key];
  }
}
