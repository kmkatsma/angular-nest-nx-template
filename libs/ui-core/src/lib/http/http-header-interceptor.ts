import { HttpInterceptor, HttpXsrfTokenExtractor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerName = 'X-XSRF-TOKEN';
    const xsrfToken = this.tokenExtractor.getToken() as string;
    let headers = request.headers.set('Content-Type', 'application/json');
    if (xsrfToken !== null && !request.headers.has(headerName)) {
      headers = headers.set(headerName, xsrfToken);
    }
    const clonedRequest = request.clone({
      headers: headers
    });
    return next.handle(clonedRequest);
  }
}
