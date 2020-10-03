import { Injectable, EventEmitter } from '@angular/core';
import { Environment } from '../environment/environment';
import { LogService } from '../logging/log.service';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseResponse } from '@ocw/shared-models';
import { map, catchError } from 'rxjs/operators';
import { saveAs } from 'file-saver';

export enum HttpAction {
  QueryStart,
  QueryStop,
}

@Injectable()
export class HttpService {
  process: EventEmitter<HttpAction> = new EventEmitter<HttpAction>();
  authFailed: EventEmitter<Error> = new EventEmitter<Error>();

  constructor(
    private _http: HttpClient,
    private environmentService: Environment,
    private logService: LogService
  ) {}

  public buildUrl(url: string): string {
    //this.logService.log('buildUrl', this.environmentService);
    return this.environmentService.apiBaseUrl + url;
  }

  public getFile(url: string, options?: any): Observable<BaseResponse> {
    return this._http.get<BaseResponse>(this.buildUrl(url));
  }

  public getImage<Blob>(url: string) {
    return this._http.get(this.buildUrl(url), {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  public getBatch(
    url: string,
    options?: any
  ): Observable<HttpResponse<BaseResponse>> {
    return this.request(
      'GET',
      this.environmentService.apiBatchUrl + url,
      null,
      options
    );
  }

  public get(
    url: string,
    options?: any
  ): Observable<HttpResponse<BaseResponse>> {
    return this.request('GET', this.buildUrl(url), null, options);
  }

  public post(url: string, body: any): Observable<HttpResponse<BaseResponse>> {
    return this.request('POST', this.buildUrl(url), body);
  }

  public upload(
    messageType: string,
    formData: FormData,
    file: File,
    fileName: string,
    keyValues?: Map<string, string>
  ) {
    formData.append('manager', new Blob(), messageType);
    formData.append('file', file, fileName);
    if (keyValues) {
      for (const [key, value] of keyValues.entries()) {
        formData.append(key, new Blob(), value);
      }
    }

    return this._http
      .post(this.buildUrl('resources/' + messageType), formData)
      .pipe(
        map((res) => res),
        catchError((error) => throwError(error))
      );
  }

  public uploadDownload(
    messageType: string,
    formData: FormData,
    file: File,
    fileName: string,
    keyValues?: Map<string, string>
  ) {
    const headers = new HttpHeaders({
      Accept: 'application/pdf',
    });

    formData.append('manager', new Blob(), messageType);
    formData.append('file', file, fileName);
    if (keyValues) {
      for (const [key, value] of keyValues.entries()) {
        formData.append(key, new Blob(), value);
      }
    }
    this._http
      .post(this.buildUrl('resources/' + messageType), formData, {
        headers: headers,
        responseType: 'blob',
        observe: 'response',
        withCredentials: true,
      })
      .subscribe((res) => {
        const saveFileName = getFileNameFromResponseContentDisposition(res);
        saveFile(res.body, saveFileName);
      });
  }

  public put(
    url: string,
    body: string
  ): Observable<HttpResponse<BaseResponse>> {
    return this.request('PUT', this.buildUrl(url), body);
  }

  public delete(url: string): Observable<HttpResponse<BaseResponse>> {
    return this.request('DELETE', this.buildUrl(url));
  }

  public patch(
    url: string,
    body: string
  ): Observable<HttpResponse<BaseResponse>> {
    return this.request('PATCH', this.buildUrl(url), body);
  }

  public head(url: string): Observable<HttpResponse<BaseResponse>> {
    return this.request('HEAD', this.buildUrl(url));
  }

  public request(
    method: string,
    url: string,
    body?: string,
    options?: any
  ): Observable<HttpResponse<BaseResponse>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return new Observable((observer) => {
      this._http
        .request(method, url, {
          body: body,
          headers: headers,
          observe: 'response',
          responseType: 'json',
          withCredentials: true,
        })
        .subscribe(
          (resp: HttpResponse<BaseResponse>) => {
            observer.next(resp);
            observer.complete();
            console.log(resp.headers.get('X-Custom-Header'));
          },
          (err) => {
            this.logService.error(
              'httpclient request error:',
              method,
              url,
              body
            );
            switch (err.status) {
              case 401: // intercept 401
                // TODO: response to authFailed by re-getting token
                this.authFailed.next(err);
                observer.error(err);
                break;
              case 403: // intercept 403
                // TODO: respond by logging someone out of application
                this.authFailed.next(err);
                observer.error(err);
                break;
              default:
                observer.error(err);
                break;
            }
          }
        );
    });
  }
}

export const saveFile = (blobContent: Blob, fileName: string) => {
  const blob = new Blob([blobContent], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};

export const getFileNameFromResponseContentDisposition = (
  res: HttpResponse<Blob>
) => {
  const contentDisposition = res.headers.get('content-disposition') || '';
  const matches = /filename=([^;]+)/gi.exec(contentDisposition);
  const fileName = (matches[1] || 'untitled').trim();
  return fileName;
};
