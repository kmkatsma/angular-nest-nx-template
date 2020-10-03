import { delay, scan, retryWhen, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse, EntityRequest, IdRequest } from '@ocw/shared-models';
import { ILoggedClass } from '../logging/logged-class';
import { HttpService } from './http.service';
import { LogService } from '../logging/log.service';

@Injectable()
export class BaseDataService implements ILoggedClass {
  constructor(
    protected httpService: HttpService,
    protected logService: LogService
  ) {}

  getClassName(): string {
    return (<any>this).constructor.name;
  }

  post(request: EntityRequest, url: string): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.post');
    return this.httpService.post(url, request.data).pipe(
      retryWhen(e =>
        e.pipe(
          scan<number>((errorCount, err) => {
            if (errorCount >= 0) {
              // dont' retry posts
              throw err;
            }
            return errorCount + 1;
          }, 0),
          delay(1000)
        )
      ),
      map(res => res.body)
    );
  }

  get(request: IdRequest, url: string): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.get');
    return this.httpService.get(url + '/' + request.id).pipe(
      retryWhen(e =>
        e.pipe(
          scan<number>((errorCount, err) => {
            if (errorCount >= 1 || err['status'] === 400) {
              throw err;
            }
            return errorCount + 1;
          }, 0),
          delay(1000)
        )
      ),
      map(res => res.body)
    );
  }

  delete(request: IdRequest, url: string): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.delete');
    return this.httpService.delete(url + '/' + request.id).pipe(
      retryWhen(e =>
        e.pipe(
          scan<number>((errorCount, err) => {
            if (errorCount >= 1) {
              throw err;
            }
            return errorCount + 1;
          }, 0),
          delay(1000)
        )
      ),
      map(res => res.body)
    );
  }

  search(request: EntityRequest, url: string): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.search');
    return this.httpService.post(url, JSON.stringify(request.data)).pipe(
      retryWhen(e =>
        e.pipe(
          scan<number>((errorCount, err) => {
            if (errorCount >= 1 || err['status'] === 400) {
              throw err;
            }
            return errorCount + 1;
          }, 0),
          delay(1000)
        )
      ),
      map(res => res.body)
    );
  }

  loadDomains(url: string): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.loadDomains');
    return this.httpService.get(url).pipe(
      retryWhen(e =>
        e.pipe(
          scan<number>((errorCount, err) => {
            if (errorCount >= 1) {
              throw err;
            }
            return errorCount + 1;
          }, 0),
          delay(1000)
        )
      ),
      map(res => res.body)
    );
  }
}
