import { Injectable, BadRequestException } from '@nestjs/common';
import { TenantDocument, TenantAttribute } from '@ocw/shared-models';

import {
  TenantTableConfig,
  TenantTableColumns,
  TenantTable,
} from './tables/tenant';
import { LogService } from '../logging/log.service';
import { AccessContext } from '../database/access-context';
import { GenericAccessUtil } from '../database/generic.access';
import { IModelFields, IModel } from '../database/db-models';
import { RequestContext } from '../middleware/models';

@Injectable()
export class TenantAccess {
  constructor(private readonly logService: LogService) {}

  async add(
    doc: TenantDocument,
    accessContext: AccessContext
  ): Promise<TenantDocument> {
    return await GenericAccessUtil.add(
      accessContext,
      doc,
      TenantTableConfig,
      {
        [TenantTableColumns.domain_name]: doc.domainName,
        [TenantTableColumns.tenant_name]: doc.tenantName,
        [TenantTableColumns.tenant_state]: doc.tenantState,
      },
      undefined,
      { skipTenantId: true }
    );
  }

  async update(
    doc: TenantDocument,
    accessContext: AccessContext
  ): Promise<TenantDocument> {
    return await GenericAccessUtil.update(
      accessContext,
      doc,
      TenantTableConfig,
      {
        [TenantTableColumns.tenant_name]: doc[TenantAttribute.tenantName],
        [TenantTableColumns.domain_name]: doc.domainName,
        [TenantTableColumns.tenant_state]: doc.tenantState,
      },
      { skipTenantId: true }
    );
  }

  async delete(
    doc: TenantDocument,
    accessContext: AccessContext
  ): Promise<TenantDocument> {
    return await GenericAccessUtil.update(
      accessContext,
      doc,
      TenantTableConfig,
      {
        [IModelFields.is_deleted]: true,
      }
    );
  }

  async getList(accessContext: AccessContext) {
    const currentUser = RequestContext.currentUser();
    if (currentUser.tenantId !== 0) {
      throw new BadRequestException('Must be global user to view all tenants');
    }
    const result = await accessContext.knex.raw(`SELECT * FROM tenant`);

    return (result as TenantTable[]).map((p) => {
      let doc = new TenantDocument();
      if (p.json_document) {
        doc = GenericAccessUtil.convertToDocument(
          p,
          TenantTableConfig,
          accessContext
        );
      }
      doc.domainName = p.domain_name;
      doc.id = p.tenant_id.toString();
      doc.tenantName = p.tenant_name;
      doc.tenantState = p.tenant_state;
      doc.isDeleted = p.is_deleted;
      doc.rowVersion = p.row_version;
      return doc;
    });
  }

  async get(id: string, accessContext: AccessContext): Promise<number> {
    const result = await accessContext.knex.raw(
      `SELECT tenant_id FROM tenant
      WHERE domain_name = ?`,
      id.toLowerCase()
    );
    this.logService.log(result, 'TenantAccess.get');
    if (result.rows) {
      return result.rows[0].tenant_id as number;
    } else {
      return result[0].tenant_id as number;
    }
  }
}
