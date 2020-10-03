import { DynamicModule, Global } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AccessContextFactory } from './database/access-context-factory';
import { AccessQueryFactory } from './database/access-query-factory';
import { ConfigService } from './configuration/config.service';
import { LogService } from './logging/log.service';
import {
  MockAccessContextFactory,
  MockAuthService,
  MockLogService,
  MockConfigService,
} from './services/testing/mock.services';
import { ServiceRegistry } from './services/service-registry.service';
import { ReferenceDataAccess } from './data-access/reference-data.access';
import { CacheUtil } from './data-access/cache.service';
import { UserAccess } from './data-access/user.access';
import { MockUserAccess } from './data-access/mock-user.access';
import { TenantAccess } from './data-access/tenant.access';
import { AuthUserGuard } from './auth/auth-user.guard';
import { Auth0Strategy } from './auth/auth0.strategy';
import { PassportModule } from '@nestjs/passport';
import { Auth0Access } from './data-access/auth0.access';
import { AuditEventAccess } from './data-access/audit-event.access';

@Global()
export class CoreTestingModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreTestingModule,
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        ServiceRegistry,
        { provide: ConfigService, useClass: MockConfigService },
        { provide: LogService, useClass: MockLogService },
        {
          provide: AccessContextFactory,
          useClass: MockAccessContextFactory,
        },

        { provide: AccessQueryFactory, useValue: {} },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Auth0Strategy, useValue: {} },
        { provide: Auth0Access, useValue: {} },
        { provide: UserAccess, useClass: MockUserAccess },
        { provide: AuthUserGuard, useValue: {} },
        { provide: ServiceRegistry, useClass: ServiceRegistry },
        { provide: CacheUtil, useClass: CacheUtil },
        { provide: ReferenceDataAccess, useValue: {} },
        { provide: TenantAccess, useValue: {} },
        { provide: AuditEventAccess, useValue: {} },
      ],

      exports: [
        LogService,
        AccessContextFactory,
        ConfigService,
        AccessQueryFactory,
        AuthService,
        PassportModule,
        ServiceRegistry,
        ReferenceDataAccess,
        CacheUtil,
        UserAccess,
        TenantAccess,
        AuditEventAccess,
      ],
    };
  }
}
