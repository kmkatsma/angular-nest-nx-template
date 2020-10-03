import { Test } from '@nestjs/testing';
import { UserInfoDocument } from '@ocw/shared-models';
import { ConfigService } from '../configuration/config.service';
import { CoreTestingModule } from '../core-testing.module';
import { LogService } from '../logging/log.service';
import { CurrentUser, RequestContext } from '../middleware/models';
import { AccessContextFactory } from './access-context-factory';
import { AuditEventUtil } from './audit/audit-event-util';
import { GenericAccessUtil, TableAction } from './generic.access';
import { KnexTestUtil } from './testing/knex-test-util';
import { TestUserInfoTable, TestUserInfoTableConfig } from './testing/table';
import { TestUserDataFactory } from './testing/test-user-data-factory';

describe('GenericAccessTests', () => {
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

  describe('buildRecords', () => {
    it('should save audit table record', async () => {
      //arrange
      const tracker = await KnexTestUtil.createTracker(accessContextFactory);
      const userA = TestUserDataFactory.createUserInfo();
      const userB = TestUserDataFactory.createUserInfo();

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
      const records = await GenericAccessUtil.buildRecords<UserInfoDocument>(
        [userA, userB],
        TestUserInfoTableConfig,
        accessContextFactory.getAccessContext(),
        currentUser,
        { field_a: 'valueA' }
      );

      //assert
      expect(records).toBeDefined();
      expect(records.length === 2);
      //Object.keys(TestUserInfoTableConfig.columns).forEach(p => {
      //  expect(records[0][p]).toBeDefined();
      //});
      expect(records[0].is_deleted).toEqual(false);
      expect(records[0].json_document).toBeDefined();
      expect(records[0].row_version).toBeDefined();
      expect(records[0].tenant_id).toBeDefined();
      expect(records[0]['field_a']).toBeDefined();
    });
  });

  describe('addAll', () => {
    it('should save all records', async () => {
      //arrange
      const tracker = await KnexTestUtil.createTracker(accessContextFactory);
      const userA = TestUserDataFactory.createUserInfo();
      const userB = TestUserDataFactory.createUserInfo();

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

      jest.spyOn(AuditEventUtil, 'auditAll');

      //act
      const count = await GenericAccessUtil.addAll<
        UserInfoDocument,
        TestUserInfoTable
      >(
        accessContextFactory.getAccessContext(),
        [userA, userB],
        TestUserInfoTableConfig,
        { field_a: 'value' }
      );

      //assert
      expect(count.length).toEqual(2);
      expect(AuditEventUtil.auditAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('add', () => {
    it('should save record', async () => {
      //arrange
      const tracker = await KnexTestUtil.createTracker(accessContextFactory);
      const userA = TestUserDataFactory.createUserInfo();

      const records: TestUserInfoTable = {
        constituent_id: 99,
        user_id: 'test_user',
        org_location_id: 1,
        provider_id: 2,
        user_sequence_id: 1,
        email_address: 'blah@blah',
        tenant_id: 1,
        json_document: JSON.stringify(userA),
        row_version: 1,
        is_deleted: false,
      };

      tracker.on('query', function checkResult(query) {
        expect(query.method).toEqual('insert');
        query.response([records]);
      });

      jest.spyOn(AuditEventUtil, 'audit');

      //act
      const count = await GenericAccessUtil.add<UserInfoDocument>(
        accessContextFactory.getAccessContext(),
        userA,
        TestUserInfoTableConfig
      );

      //assert
      expect(count.emailAddress).toEqual(records.email_address);
      expect(AuditEventUtil.audit).toHaveBeenCalledTimes(1);
    });
  });

  describe('convertToDocument', () => {
    it('should populate document fields from table', async () => {
      //arrange
      const userA = TestUserDataFactory.createUserInfo();

      const records: TestUserInfoTable = {
        constituent_id: 99,
        user_id: 'test_user',
        org_location_id: 5,
        provider_id: 2,
        user_sequence_id: 1,
        email_address: 'blah@blah',
        tenant_id: 1,
        json_document: JSON.stringify(userA),
        row_version: 1,
        is_deleted: false,
      };

      //act
      const count = await GenericAccessUtil.convertToDocument<UserInfoDocument>(
        records,
        TestUserInfoTableConfig,
        accessContextFactory.getAccessContext()
      );

      //assert
      expect(count.locationId).toEqual(5);
      expect(count.emailAddress).toEqual(records.email_address);
    });
  });

  describe('convertToTable', () => {
    it('should populate table fields from document', async () => {
      //arrange
      const userA = TestUserDataFactory.createUserInfo();

      //act
      const count = await GenericAccessUtil.convertToTable<TestUserInfoTable>(
        userA,
        TestUserInfoTableConfig,
        accessContextFactory.getAccessContext(),
        currentUser,
        TableAction.Insert,
        {}
      );

      //assert
      expect(count.tenant_id).toEqual(1);
    });
  });
});
