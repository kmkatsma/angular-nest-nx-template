import { DynamicModule, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthUserGuard } from './auth/auth-user.guard';
import { AuthService } from './auth/auth.service';
import { AccessContextFactory } from './database/access-context-factory';
import { AccessQueryFactory } from './database/access-query-factory';
import { ConfigService } from './configuration/config.service';
import { LogService } from './logging/log.service';
import { ServiceRegistry } from './services/service-registry.service';
import { CacheUtil } from './data-access/cache.service';
import { ReferenceDataAccess } from './data-access/reference-data.access';
import { UserAccess } from './data-access/user.access';
import { TenantAccess } from './data-access/tenant.access';
import { ExportAccess } from './data-access/export.access';
import { AuditEventAccess } from './data-access/audit-event.access';
import { UserMaintenanceAuth0Access } from './data-access/user-maintenance-auth0.access';
import { Auth0Access } from './data-access/auth0.access';
import { AuthStrategy } from './auth/auth.strategy';

@Global()
export class CoreAzAdModule {
  static forRoot(): DynamicModule {
    return {
      imports: [PassportModule.register({ defaultStrategy: 'oidc-bearer' })],
      module: CoreAzAdModule,
      providers: [
        LogService,
        {
          provide: ConfigService,
          useValue: new ConfigService(
            `./env/${process.env.NODE_ENV}.env`,
            new LogService()
          ),
        },
        AccessContextFactory,
        AccessQueryFactory,
        AuthService,
        UserAccess,
        Auth0Access,
        UserMaintenanceAuth0Access,
        ServiceRegistry,
        CacheUtil,
        ReferenceDataAccess,
        TenantAccess,
        ExportAccess,
        AuditEventAccess,
        AuthStrategy,
        AuthUserGuard,
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
        UserMaintenanceAuth0Access,
        TenantAccess,
        ExportAccess,
        AuditEventAccess,
      ],
    };
  }
}
