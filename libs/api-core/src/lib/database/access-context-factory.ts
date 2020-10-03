import { Injectable } from '@nestjs/common';
import * as Knex from 'knex';
import { ConfigService } from '../configuration/config.service';
import { LogService } from '../logging/log.service';
import { AccessContext } from './access-context';

@Injectable()
export class AccessContextFactory {
  public knex: Knex;
  public isPostgres: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService
  ) {
    this.isPostgres = configService.isPostgres;
  }

  static buildKnex(configService: ConfigService, logService: LogService) {
    let knexConfig = {};
    if (configService.get('DB_TYPE') === 'mssql') {
      knexConfig = {
        driver: 'msnodesqlv8',
        client: 'mssql',
        connection: {
          server: configService.get('DB_URL'),
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          parseJSON: true,
          options: {
            trustedConnection: true,
            abortTransactionOnError: true
          }
        },
        pool: { min: 0, max: 10 }
      };
    } else {
      knexConfig = {
        client: 'postgresql',
        connection: {
          host: configService.get('DB_URL'),
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          options: {
            ssl: configService.get('DB_SSL')
          }
        },
        pool: { min: 0, max: 10 }
      };
    }
    const knex = Knex(knexConfig);
    if (configService.isDevelopment) {
      knex.on('query', logService.logQuery);
    }
    return knex;
  }

  getAccessContext(): AccessContext {
    return new AccessContext(this.logService, this.knex, this.isPostgres);
  }

  async onModuleInit() {
    this.knex = AccessContextFactory.buildKnex(
      this.configService,
      this.logService
    );
  }
}
