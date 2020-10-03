import { Injectable } from '@nestjs/common';
import { LogService } from '../logging/log.service';
import { AccessContext } from '../database/access-context';
import { GenericAccessUtil } from '../database/generic.access';
import { ITableConfig } from '../database/db-models';
import { BaseDocument } from '@ocw/shared-models';

@Injectable()
export class ExportAccess {
  constructor(private readonly logService: LogService) {}

  async export(
    tableConfig: ITableConfig,
    accessContext: AccessContext
  ): Promise<BaseDocument[]> {
    this.logService.log('start', '[ExportAccess.export]');
    return await GenericAccessUtil.getListForClause(
      accessContext,
      tableConfig,
      {}
    );
  }
}
