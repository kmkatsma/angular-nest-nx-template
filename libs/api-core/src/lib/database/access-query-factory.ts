import { Injectable } from '@nestjs/common';
import { LogService } from '../logging/log.service';
import { AccessContextFactory } from './access-context-factory';
import { AccessQuery } from './access-query';
import { IAccessQuery } from './access-query-base';
import { AccessQueryMsSql } from './access-query-mssql';
import { ITableConfig } from './db-models';
import { AccessQueryNew } from './access-query-new';
import { AccessContext } from './access-context';

@Injectable()
export class AccessQueryFactory {
  constructor(
    private readonly logService: LogService,
    private readonly accessContextFactory: AccessContextFactory
  ) {}

  createQuery(tableConfig: ITableConfig): IAccessQuery {
    const accessContext = this.accessContextFactory.getAccessContext();
    if (accessContext.isPostgres) {
      return new AccessQuery(accessContext, tableConfig, this.logService);
    } else {
      return new AccessQueryMsSql(accessContext, tableConfig, this.logService);
    }
  }
  
  createQueryNew(tableConfig: ITableConfig, accessContext: AccessContext): AccessQueryNew {
    return new AccessQueryNew(accessContext, tableConfig, this.logService);
   }
}
