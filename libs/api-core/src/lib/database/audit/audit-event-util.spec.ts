import { Test } from '@nestjs/testing';
import { UserInfoDocument } from '@ocw/shared-models';
import { CurrentUser, RequestContext } from '../../middleware/models';
import { AuditEventUtil } from './audit-event-util';
import { AuditEventType } from './audit-event.config';
import { AccessContextFactory } from '../access-context-factory';
import { ConfigService } from '../../configuration/config.service';
import { LogService } from '../../logging/log.service';
import { CoreTestingModule } from '../../core-testing.module';
import { TestUserInfoTableConfig } from '../testing/table';
import { IModel } from '../db-models';
import { TestUserDataFactory } from '../testing/test-user-data-factory';
import { KnexTestUtil } from '../testing/knex-test-util';

describe('AuditEventUtilTests', () => {
  let accessContextFactory: AccessContextFactory;
  let configService: ConfigService;
  let logService: LogService;
  let currentUser: CurrentUser;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [CoreTestingModule.forRoot()],
    }).compile();
    configService = app.get<ConfigService>(ConfigService);
    logService = app.get<LogService>(LogService);
    accessContextFactory = new AccessContextFactory(configService, logService);
    jest.clearAllMocks();
    const mockStaticF = jest.fn();
    currentUser = {
      tenantId: 1,
      userId: 'test',
      userName: 'test',
      id: '1',
      tenantDomain: 'test.com',
      tenantState: 'IL',
      isProvider: true,
      providerId: '1',
      roles: [],
      email: 'test@test.com',
      container: '',
      constituentId: '1',
      locationId: 1,
    };
    mockStaticF.mockReturnValue(currentUser);
    RequestContext.currentUser = mockStaticF.bind(RequestContext);
  });

  describe('audit', () => {
    it('should save audit table record', async () => {
      //arrange
      const userInfo = TestUserDataFactory.createUserInfo();
      const tracker = await KnexTestUtil.createTracker(accessContextFactory);
      tracker.on('query', function checkResult(query) {
        expect(query.method).toEqual('insert');
        query.response([
          {
            fielda: 'A',
            fieldb: 'B',
          },
        ]);
      });

      //act
      const record = await AuditEventUtil.audit<UserInfoDocument>(
        accessContextFactory.getAccessContext(),
        1,
        TestUserInfoTableConfig,
        AuditEventType.insert,
        userInfo
      );

      //assert
      expect(record).toBeDefined();
    });
  });

  describe('auditAll', () => {
    it('should save audit table records', async () => {
      //arrange
      const userInfo = TestUserDataFactory.createUserInfo();
      const tracker = await KnexTestUtil.createTracker(accessContextFactory);

      tracker.on('query', function checkResult(query) {
        expect(query.method).toEqual('insert');
        query.response([
          {
            fielda: 'A',
          },
          {
            fielda: 'A',
          },
        ]);
      });

      const records: IModel[] = [
        { tenant_id: 1, json_document: '', row_version: 1, is_deleted: false },
        { tenant_id: 1, json_document: '', row_version: 1, is_deleted: false },
      ];

      //act
      const count = await AuditEventUtil.auditAll<UserInfoDocument>(
        accessContextFactory.getAccessContext(),
        TestUserInfoTableConfig,
        records
      );

      //assert
      expect(count).toEqual(2);
    });
  });

  describe('convertDocument', () => {
    it('should build table', () => {
      //arrange
      const userInfo = new UserInfoDocument();
      userInfo.emailAddress = 'test@gmail';
      userInfo.locationId = 1;
      const ac = accessContextFactory.getAccessContext();

      //act
      const tableRecord = AuditEventUtil.createTableRecord(
        userInfo,
        ac,
        1,
        currentUser,
        'table',
        AuditEventType.insert
      );

      //assert
      expect(tableRecord.event_date).toBeDefined();
      expect(tableRecord.event_type).toEqual(AuditEventType.insert);
      expect(tableRecord.is_deleted).toEqual(false);
      expect(tableRecord.json_document).toBeDefined();
      expect(tableRecord.row_version).toBeDefined();
      expect(tableRecord.table_name).toEqual('table');
      expect(tableRecord.user_id).toEqual('test');
    });
  });
});
