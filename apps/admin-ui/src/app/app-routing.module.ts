import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from '@ocw/ui-components';
import { DashboardComponent } from 'angular-google-charts';
import { TenantsComponent } from './modules/tenants/tenants.component';
import { UserAdminComponent } from './modules/users/user-admin.component';

export const AppPathEnum = {
  UrlLogin: 'login',
  UrlLoginFailed: 'login-process',
  UrlLoading: 'loading',
  UrlDashboard: 'app',
  UrlNotFound: 'not-found',
  UrlDefault: 'default',
  UrlAdmin: 'admin',
  UrlHome: 'home',
  UrlReports: 'reports',
  UrlViewer: 'viewer',
  UrlTable: 'table',
  UrlDashboardNotFound: 'not-found',
  UserProfile: 'user-profile',
  UrlAdminUsers: 'admin-users',
};

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: AppPathEnum.UrlHome, pathMatch: 'full' },

      {
        path: AppPathEnum.UrlHome,
        component: DashboardComponent,
      },
      {
        path: 'tenants',
        component: TenantsComponent,
      },
      {
        path: 'users',
        component: UserAdminComponent,
      },
      { path: AppPathEnum.UrlNotFound, component: NotFoundComponent },
      { path: '**', redirectTo: AppPathEnum.UrlNotFound },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
