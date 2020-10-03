import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { LogService } from '../logging/log.service';
import { Auth0Service } from './auth0.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private auth0Service: Auth0Service,
    private router: Router,
    private logService: LogService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean | UrlTree> | boolean {
    /*if (this.authService.currentUser) {
      return true;
    } else {
      console.log(
        'Auth Guard: route to url login failed',
        this.authService.currentUser
      );
      this.router.navigate([AppPathEnum.UrlLoginFailed]);
      return false;
    }*/

    return this.authService.systemUserLoaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.logService.log('auth guard, sytem user not logged in');
        }
      })
    );
    /*return this.auth0Service.isAuthenticated$.pipe(
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('trying to log in from guard');
          //this.auth0Service.login(state.url);
        }
      })
    );*/
  }
}
