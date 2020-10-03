import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MockAuthService } from './auth/mock.auth.service';
import { LogService } from './logging/log.service';
import { Environment } from './environment/environment';
import { AuthGuardService } from './auth/auth-guard.service';
import { ReportService } from './reports/reports.service';
import { EventsService } from './events/events.service';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AuthTokenInterceptor } from './http/auth-token.interceptor';
import { Auth0Service } from './auth/auth0.service';
import { AuthService } from './auth/auth.service';
import { AdminService } from './admin/admin.service';

@NgModule({
  imports: [HttpClientModule, HttpClientXsrfModule],
  declarations: [],
  providers: [
    AuthGuardService,
    AuthService,
    LogService,
    //ConfigurationLoaderService,
    Auth0Service,
    ReportService,
    EventsService,
    MockAuthService,
    AuthTokenInterceptor,
    AdminService,
  ],
  exports: [],
})
export class UiCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: UiCoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
