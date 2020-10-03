import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BaseDocumentField,
  BaseDomainKeyEnum,
  SystemReferenceType,
  TenantDocument,
  UserInfoDocument,
  UserInfoFilter,
  UserProfileDocument,
} from '@ocw/shared-models';
import { AccessContext } from '../database/access-context';
import { AccessContextFactory } from '../database/access-context-factory';
import { AccessQueryFactory } from '../database/access-query-factory';
import { GenericAccessUtil } from '../database/generic.access';
import { LogService } from '../logging/log.service';
import { CurrentUser, RequestContext, UserToken } from '../middleware/models';
import { ReferenceDataAccess } from './reference-data.access';
import { TenantTableConfig } from './tables/tenant';
import {
  UserInfoTableConfig,
  UserTableColumns,
  UserWithTenant,
  UserwithTenantFields,
} from './tables/user_info';

@Injectable()
export class UserAccess {
  private userMap = new Map<string, UserInfoDocument>();

  constructor(
    private readonly logService: LogService,
    private readonly accessQueryFactory: AccessQueryFactory,
    private readonly accessContextFactory: AccessContextFactory,
    private readonly referenceDataAccess: ReferenceDataAccess
  ) {}

  async getCurrentUser(userId: string): Promise<boolean> {
    let dbUserInfo: UserInfoDocument;

    dbUserInfo = this.userMap.get(userId);
    if (!dbUserInfo) {
      const user = await this.getByUserId(
        userId,
        this.accessContextFactory.getAccessContext()
      );
      if (user) {
        dbUserInfo = user;
        this.userMap.set(userId, dbUserInfo);
      } else {
        return false;
      }
      console.log('USER SET FROM DB', dbUserInfo);
    } else {
      this.logService.log('USER CACHE HIT');
    }
    RequestContext.setCurrentUser(new CurrentUser(dbUserInfo));
    return true;
  }

  async hasPermission(permission: number): Promise<boolean> {
    const userContext = RequestContext.currentUser();

    console.log('currentUser', userContext);
    //TODO: check user roles against permission
    const permissions = this.referenceDataAccess.getReferenceDataType(
      BaseDomainKeyEnum.System,
      SystemReferenceType.permissions
    );
    return true;
  }

  async isInRole(role: number): Promise<boolean> {
    const userContext = RequestContext.currentUser();
    if (userContext.roles && userContext.roles.find((p) => p === role)) {
      return true;
    } else {
      return false;
    }
  }

  getProviderId(): string {
    const userContext = RequestContext.currentUser();
    return userContext.providerId.toString();
  }

  async get<T extends UserInfoDocument>(
    id: string,
    accessContext: AccessContext
  ): Promise<T> {
    return (await GenericAccessUtil.get(
      accessContext,
      id,
      UserInfoTableConfig
    )) as T;
  }

  async getProfile<T extends UserProfileDocument>(
    id: string,
    accessContext: AccessContext
  ): Promise<T> {
    return await GenericAccessUtil.get(accessContext, id, UserInfoTableConfig);
  }

  async saveProfile<T extends UserProfileDocument>(
    id: string,
    accessContext: AccessContext
  ): Promise<T> {
    //TODO: add save
    return await GenericAccessUtil.get(accessContext, id, UserInfoTableConfig);
  }

  async getByUserId(
    userId: string,
    accessContext: AccessContext
  ): Promise<UserInfoDocument> {
    const result = await accessContext.knex.raw(
      `
      SELECT ui.user_sequence_id, ui.user_id, ui.json_document, ui.tenant_id, ui.email_address
        , t.tenant_state
        , t.json_document as ${UserwithTenantFields.tenant_json}
        , p.provider_id
      FROM user_info ui
      LEFT JOIN tenant t on ui.tenant_id = t.tenant_id
      LEFT JOIN provider p on ui.user_sequence_id = p.user_id
      WHERE ui.user_id = ?
      `,
      userId
    );
    this.logService.log(result, 'UserInfo.getByUserId');
    if (result.rows) {
      if (result.rows.length > 0) {
        return this.mapUser(result.rows[0]);
      } else {
        return undefined;
      }
    } else {
      if (result.length > 0) {
        return this.mapUser(result[0]);
      } else {
        return undefined;
      }
    }
  }

  async getByUserEmail(
    emailAddress: string,
    accessContext: AccessContext
  ): Promise<UserInfoDocument> {
    const result = await accessContext.knex.raw(
      `
      SELECT  ui.user_sequence_id, ui.user_id, ui.json_document, ui.tenant_id, ui.email_address
      , t.tenant_state  t.json_document as tenant_json, p.provider_id
      FROM user_info ui
      JOIN tenant t on ui.tenant_id = t.tenant_id
      LEFT JOIN provider p on ui.user_sequence_id = p.user_id
      WHERE email_address = ?
      `,
      emailAddress
    );
    this.logService.log(result, 'UserInfo.getByUserEmail');
    if (result.rows) {
      if (result.rows.length > 0) {
        return this.mapUser(result.rows[0]);
      } else {
        return undefined;
      }
    } else {
      if (result.length > 0) {
        return this.mapUser(result[0]);
      } else {
        return undefined;
      }
    }
  }

  async getListForTenant(tenantId: string, accessContext: AccessContext) {
    const currentUser = RequestContext.currentUser();
    if (currentUser.tenantId !== 0) {
      throw new BadRequestException('Must be global user to view all users');
    }
    const result = await accessContext.knex.raw(
      `
    SELECT  ui.user_sequence_id, ui.user_id, ui.json_document, ui.tenant_id, ui.email_address
    , t.tenant_state  t.json_document as tenant_json, p.provider_id
    FROM user_info ui
    JOIN tenant t on ui.tenant_id = t.tenant_id
    WHERE ui.tenant_id = ?  
    `,
      tenantId
    );

    return (result as UserWithTenant[]).map((p) => {
      const doc = this.mapUser(p);
      return doc;
    });
  }

  async search<T extends UserInfoDocument>(
    searchRequest: UserInfoFilter,
    accessContext: AccessContext
  ): Promise<T[]> {
    const accessQuery = this.accessQueryFactory.createQuery(
      UserInfoTableConfig
    );

    if (searchRequest.userId) {
      accessQuery.addWhere(UserTableColumns.user_id, searchRequest.userId);
    }

    accessQuery.Columns.addColumnWithName(
      UserInfoTableConfig.keyFieldName,
      BaseDocumentField.id
    );

    let items = await accessQuery.select();
    this.logService.log(items, '[User.search items]');
    items = (items as UserWithTenant[]).map((p) => {
      const doc = this.mapUser(p);
      return doc;
    });

    return items;
  }

  mapUser(p: UserWithTenant) {
    let doc = new UserInfoDocument();
    const requestContext = RequestContext.currentRequestContext();
    if (p.json_document) {
      doc = GenericAccessUtil.convertToDocument<UserInfoDocument>(
        p,
        UserInfoTableConfig,
        this.accessContextFactory.getAccessContext()
      );
    }
    const token = requestContext.request.user as UserToken;
    doc.fullName = token.name;
    doc.emailAddress = token.email;

    //tenant
    doc.tenantId = p.tenant_id;
    if (p.tenant_state) {
      doc.tenantState = p.tenant_state;
    }
    const tenantJson = p.tenant_json;
    if (tenantJson) {
      const tenantDoc = GenericAccessUtil.convertToObject<TenantDocument>(
        p,
        TenantTableConfig.keyFieldName,
        this.accessContextFactory.getAccessContext(),
        UserwithTenantFields.tenant_json
      );
      doc.tenantFeatures = tenantDoc.features;
    }

    if (!doc.fullName) {
      doc.fullName = doc.firstName + ' ' + doc.lastName;
    }

    if (p.provider_id) {
      doc.providerId = p.provider_id.toString();
    } else {
      doc.providerId = undefined;
    }
    if (!doc.emailAddress) {
      doc.emailAddress = p.email_address;
    }
    doc.userId = p.user_id;
    doc.referenceGroup = BaseDomainKeyEnum.User;
    doc.referenceType = BaseDomainKeyEnum.User;
    if (doc.emailAddress) {
      doc.val = doc.emailAddress.split('@')[0].toUpperCase();
    } else {
      console.log('missing email', doc);
    }
    return doc;
  }
}
