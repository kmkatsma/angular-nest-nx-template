import { LogService } from '../logging/log.service';
//import { AdalService } from 'adal-angular4';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { mergeMap, catchError } from 'rxjs/operators';
import { Auth0Service } from '../auth/auth0.service';
import { throwError } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(
    //private adal: AdalService,
    private auth0Service: Auth0Service,
    private logService: LogService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // merge the bearer token into the existing headers
    if (req.url === 'assets/config/config.json') {
      return next.handle(req);
    }
    return this.auth0Service.getTokenSilently$().pipe(
      mergeMap((token) => {
        const authorizedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        /*const tokenReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });*/
        return next.handle(authorizedRequest);
      }),
      catchError((err) => throwError(err))
    );

    /*return this.adal
      .acquireToken(this.environmentService.adalConfig.clientId)
      .pipe(
        mergeMap((token: string) => {
          const authorizedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(authorizedRequest);
        })
      );*/
  }
}
