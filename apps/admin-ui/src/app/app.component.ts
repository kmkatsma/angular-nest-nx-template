import { Component, OnInit } from '@angular/core';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';
import { AuthService } from '@ocw/ui-core';
import { environment } from '../environments/environment';
import { AppMenuItem } from '@ocw/shared-models';

@Component({
  selector: 'ocw-root',
  template: `
    <ocw-layout
      [loggedIn]="loggedIn"
      [homeMenu]="homeMenu"
      [userInfo]="ocwAuth.currentUser"
      title="Admin"
    >
      <main>
        <!--button mat-raised-button *ngIf="!loggedIn" (click)="login()">
          Login
        </button>
        <button mat-raised-button *ngIf="loggedIn" (click)="logout()">
          Logout
        </button-->
      </main>

      <router-outlet></router-outlet
    ></ocw-layout>
  `,
})
export class AppComponent implements OnInit {
  title = 'admin-ui';
  loggedIn = false;
  homeMenu: AppMenuItem[];

  constructor(
    private broadcastService: BroadcastService,
    private authService: MsalService,
    public ocwAuth: AuthService
  ) {}

  ngOnInit() {
    this.homeMenu = this.loadHomeMenu();
    this.checkAccount();

    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkAccount();
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response.accessToken);
    });

    this.authService.setLogger(
      new Logger(
        (logLevel, message, piiEnabled) => {
          console.log('MSAL Logging: ', message);
        },
        {
          correlationId: CryptoUtils.createNewGuid(),
          piiLoggingEnabled: false,
        }
      )
    );

    this.ocwAuth.loadUser();
  }

  login() {
    const isIE =
      window.navigator.userAgent.indexOf('MSIE ') > -1 ||
      window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.authService.loginRedirect({
        scopes: ['openid', `${environment.adalConfig.clientId}/.default`],
        extraScopesToConsent: ['user.read', 'openid', 'profile'],
      });
    } else {
      this.authService.loginPopup({
        extraScopesToConsent: ['user.read', 'openid', 'profile'],
      });
    }

    const requestObj = {
      scopes: ['openid', `${environment.adalConfig.clientId}/.default`],
    };

    this.authService
      .acquireTokenSilent(requestObj)
      .then(function (tokenResponse) {
        // Callback code here
        console.log(tokenResponse.accessToken);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

  logout() {
    this.authService.logout();
  }

  loadHomeMenu() {
    const list = [];
    const home = new AppMenuItem(1, 'Home', 'Home');
    home.icon = 'home';
    home.toolTip = 'Home';
    home.route = '/home';
    list.push(home);

    const tenants = new AppMenuItem(2, 'Tenants', 'Tenants');
    tenants.icon = 'business';
    tenants.toolTip = 'Tenants';
    tenants.route = '/tenants';
    list.push(tenants);

    const users = new AppMenuItem(3, 'Users', 'Users');
    users.icon = 'people';
    users.toolTip = 'Users';
    users.route = '/users';
    list.push(users);
    return list;
  }
}
