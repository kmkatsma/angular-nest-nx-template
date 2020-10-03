import { Injectable } from '@nestjs/common';
import {
  AuditEventSearchRecord,
  AuditEventSearchRequest
} from '@ocw/shared-models';
import * as R from 'rambda';
import { AccessContext } from '../database/access-context';
import {
  AuditEvent,
  AuditEventTableColumns,
  AuditEventTableConfig
} from '../database/audit/audit-event.config';
import { GenericAccessUtil } from '../database/generic.access';
import { LogService } from '../logging/log.service';
import { DiffUtil } from '../utilities/diff.util';

@Injectable()
export class AuditEventAccess {
  constructor(private readonly logService: LogService) {}

  async search(
    request: AuditEventSearchRequest,
    accessContext: AccessContext
  ): Promise<AuditEventSearchRecord[]> {
    const filter: AuditEvent = {};
    if (request.objectId) {
      filter.table_row_id = Number(request.objectId);
    }
    if (request.tableName) {
      filter.table_name = request.tableName;
    }
    let references = await GenericAccessUtil.getTableRowsForClause(
      accessContext,
      AuditEventTableConfig,
      filter
    );
    if (request.buildDiff) {
      references = R.sortBy(R.path([AuditEventTableColumns.event_date]))(
        references
      );
    }

    let lastRow: AuditEventSearchRecord;
    let results = references.map((row: AuditEvent) => {
      const record = new AuditEventSearchRecord();
      record.eventDate = row.event_date;
      record.eventType = row.event_type;
      record.document = JSON.parse(row.json_document);
      record.objectId = row.table_row_id.toString();
      record.tableName = row.table_name;
      record.userName = row.user_id;
      if (request.buildDiff) {
        if (lastRow) {
          record.diff = DiffUtil.getDifferences(
            lastRow.document,
            record.document
          );
        }
      }
      lastRow = record;
      return record;
    });
    results = R.reverse(results);

    return results;
  }
}
