import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { EffectsModule } from '@ngrx/effects';
import { CustomMaterialModule, UiComponentsModule } from '@ocw/ui-components';
import {
  AuthService,
  Environment,
  HttpService,
  UiStateModule,
} from '@ocw/ui-core';
import { UiLayoutModule } from '@ocw/ui-layout';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { msalAngularConfig, msalConfig } from './app.config';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { TenantEditComponent } from './modules/tenants/tenant-edit.component';
import { TenantSearchComponent } from './modules/tenants/tenants-search.component';
import { TenantsComponent } from './modules/tenants/tenants.component';
import { UserAdminComponent } from './modules/users/user-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TenantsComponent,
    TenantSearchComponent,
    TenantEditComponent,
    UserAdminComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MsalModule.forRoot(msalConfig, msalAngularConfig),
    ReactiveFormsModule,
    MatNativeDateModule,
    UiStateModule.forRoot(),
    EffectsModule.forRoot([]),
    FlexLayoutModule,
    UiComponentsModule,
    UiLayoutModule,
    CustomMaterialModule,
    AppRoutingModule,
  ],
  providers: [
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    { provide: Environment, useValue: environment },
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
