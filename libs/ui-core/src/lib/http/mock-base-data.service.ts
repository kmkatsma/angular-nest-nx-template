import { Injectable } from '@angular/core';
import {
  BaseResponse,
  EntityRequest,
  IdRequest,
  ResponseStatus
} from '@ocw/shared-models';
import { Observable, of as observableOf } from 'rxjs';
import { LogService } from '../logging/log.service';
import { BaseDataService } from './base-data.service';
import { HttpService } from './http.service';

@Injectable()
export class MockBaseDataService extends BaseDataService {
  constructor(
    protected httpService: HttpService,
    protected logService: LogService
  ) {
    super(httpService, logService);
  }

  post(request: EntityRequest): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.post');
    const responseStatus = new ResponseStatus();
    const response = new BaseResponse(responseStatus);
    return observableOf(response);
  }

  get(request: IdRequest, url: string): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.get');
    return this.httpService.getFile(url);
  }

  search(request: EntityRequest, url: string): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.search');
    return this.httpService.getFile(url);
  }

  loadDomains(url): Observable<BaseResponse> {
    this.logService.log(this.getClassName() + '.loadDomains');
    return this.httpService.getFile(url);
  }
}
