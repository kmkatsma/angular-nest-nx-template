import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DomainEffects } from './effects/domain-effects';
import { ResourceEffects } from './effects/resource-effects';
import { SearchEffects } from './effects/search-effects';
import { logout, reducers } from './reducers/global-reducer';
import { EffectsService } from './effects/effects-utils';
import { BaseDataServiceProvider } from '../http/data.provider';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AuthGuardService } from '../auth/auth-guard.service';
//import { AuthServiceProvider } from '../auth/auth.service.provider';
import { LogService } from '../logging/log.service';
//import { ConfigurationLoaderService } from '../environment/configuration-loader.service';
import { ReportService } from '../reports/reports.service';
import { MockAuthService } from '../auth/mock.auth.service';
//import { AdalService, AdalGuard } from 'adal-angular4';
import { EventsService } from '../events/events.service';
import { AuthTokenInterceptor } from '../http/auth-token.interceptor';
import { ResourceStoreService } from './store-services/resource-store-service';
import { SearchStoreService } from './store-services/search-store-service';
import { DomainStoreService } from './store-services/domain-store.service';
import { AppStoreService } from './store-services/app-store.service';
import { StatusStoreService } from './store-services/status-store.service';
import { AuthService } from '../auth/auth.service';

/*
 imports: [HttpClientModule, HttpClientXsrfModule],
  declarations: [],
  providers: [
    AuthGuardService,
    AuthServiceProvider,
    LogService,
    ConfigurationLoaderService,
    
    ReportService,
    EventsService,
    MockAuthService,
    AdalService,
    AdalGuard,
    AuthTokenInterceptor
  ],
  */

@NgModule({
  imports: [
    HttpClientModule,
    HttpClientXsrfModule,
    StoreModule.forRoot(reducers, {
      metaReducers: [logout],
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    EffectsModule.forFeature([DomainEffects, ResourceEffects, SearchEffects]),
  ],
  declarations: [],
  providers: [
    BaseDataServiceProvider,
    EffectsService,
    AuthGuardService,
    LogService,
    //ConfigurationLoaderService,
    ReportService,
    EventsService,
    MockAuthService,
    //AdalService,
    //AdalGuard,
    AuthTokenInterceptor,
    ResourceStoreService,
    SearchStoreService,
    DomainStoreService,
    AppStoreService,
    StatusStoreService,
    AuthService,
  ],
  exports: [],
  entryComponents: [],
})
export class UiStateModule {
  static forRoot(): ModuleWithProviders<UiStateModule> {
    return {
      ngModule: UiStateModule,
    };
  }
  constructor(@Optional() @SkipSelf() parentModule: UiStateModule) {
    if (parentModule) {
      throw new Error(
        'UiStateModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
