import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import {
  HttpService,
  getFileNameFromResponseContentDisposition,
  saveFile,
} from '../http/http.service';

import { LogService } from '../logging/log.service';
import { BaseFilter } from '@ocw/shared-models';
import { Environment } from '../environment/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { StatusStoreService } from '../state/store-services/status-store.service';

export enum DownloadEndpoint {
  API = 'API',
  Report = 'Report',
}

export enum ReportContentType {
  Excel = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  Word = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export class ReportConfig {
  reportName: string;
  reportFilter: BaseFilter;
  type: ReportContentType;
}

export class DownloadMessages {
  constructor(
    public successMessage: string,
    public error404Message: string,
    public error400Message: string
  ) {}
}

export class ReportResponse {
  public returnCode: string;
}

@Injectable()
export class ReportService {
  constructor(
    private httpService: HttpService,
    private environmentService: Environment,
    private logService: LogService,
    private statusStoreService: StatusStoreService,
    private http: HttpClient
  ) {}

  public buildUrl(url: string, endpoint?: DownloadEndpoint): string {
    if (!endpoint) {
      return this.environmentService.apiReportsUrl + url;
    } else {
      if (endpoint === DownloadEndpoint.API) {
        return this.environmentService.apiBaseUrl + url;
      } else {
        return this.environmentService.apiReportsUrl + url;
      }
    }
  }

  downloadFileGet(url: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Process the file downloaded
    this.http
      .get(this.buildUrl(url), {
        headers: headers,
        responseType: 'blob',
        observe: 'response',
        withCredentials: true,
      })
      .subscribe((res) => {
        const fileName = getFileNameFromResponseContentDisposition(res);
        saveFile(res.body, fileName);
      });
  }

  downloadFilePost(
    url: string,
    config: any,
    options?: { endpoint?: DownloadEndpoint; contentType?: ReportContentType }
  ) {
    let fullUrl = this.buildUrl(url);
    let accept = ReportContentType.Excel;
    if (options && options.contentType) {
      accept = options.contentType;
    }
    if (options && options.endpoint) {
      fullUrl = this.buildUrl(url, options.endpoint);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: accept,
    });

    // Process the file downloaded
    this.http
      .post(fullUrl, config, {
        headers: headers,
        responseType: 'blob',
        observe: 'response',
        withCredentials: true,
      })
      /* .subscribe(res => {
        console.log('content-disposition', res.headers);
        const fileName = getFileNameFromResponseContentDisposition(res);
        saveFile(res.body, fileName);
      });*/
      .subscribe(
        (data) => {
          console.log('success', data);
          const fileName = getFileNameFromResponseContentDisposition(data);
          saveFile(data.body, fileName);
        },
        (error: HttpErrorResponse) => {
          console.log('error', error);
          if (error.status === 404) {
            this.statusStoreService.publishError('No data found');
            return;
          }
          if (error.status === 400) {
            this.statusStoreService.publishError('Missing report criteria');
            return;
          }
          this.statusStoreService.publishError(
            'Export Failed with unknown error'
          );
        }
      );
  }

  //TODO: swap to http, with filesaver
  // https://stackoverflow.com/questions/48553958/how-to-download-an-excel-xlsx-file-using-angular-5-httpclient-get-method-with
  /*runReport(url: string, config: ReportConfig) {
    let xhr = new XMLHttpRequest();

    const reportFilter = config.reportFilter;

    xhr.open('POST', this.buildUrl(url), true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.responseType = 'blob';
    let params = JSON.stringify(reportFilter);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let contentType = config.type;
          let blob = new Blob([xhr.response], { type: contentType });
          let a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = config.reportName;
          a.click();
        } else {
        }
      }
    };
    xhr.send(params);
  }*/

  getReport(url: string, config: ReportConfig) {
    const xhr = new XMLHttpRequest();

    const reportFilter = config.reportFilter;

    xhr.open('GET', this.buildUrl(url), true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.responseType = 'blob';
    const params = JSON.stringify(reportFilter);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const contentType = config.type;
          const blob = new Blob([xhr.response], { type: contentType });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = config.reportName;
          a.click();
        } else {
        }
      }
    };
    xhr.send(params);
  }

  toGMTDate(date: Date): Date {
    return new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
  }

  downloadReport(
    url: string,
    reportFilter: any,
    reportName: string,
    messages: DownloadMessages
  ) {
    const xhr = new XMLHttpRequest();
    const response = new ReportResponse();

    xhr.open('POST', this.buildUrl(url), true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.responseType = 'blob';
    const params = JSON.stringify(reportFilter);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const contentType =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          const blob = new Blob([xhr.response], { type: contentType });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = reportName;
          a.click();
          return response;
        } else {
          this.logService.log('xhr', xhr);
          if (xhr.status === 404) {
            return response;
          } else {
            if (xhr.status === 400) {
              return response;
            } else {
              return response;
            }
          }
          return response;
        }
      }
    };
    xhr.send(params);
  }

  /*printMailLabels(url: string, reportFilter: PrintMailLabelRequest, reportName: string) {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', this.httpService.buildUrl(url), true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.responseType = 'blob';
    let params = JSON.stringify(reportFilter);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {

          let contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          let blob = new Blob([xhr.response], { type: contentType });
          let a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = reportName;
          a.click();
          this.statusService.publishMessage('Mail Labels created');
        } else {
          this.logService.log('xhr', xhr);
          if (xhr.status === 404) {
            this.statusService.publishError('No mail labels to print');
          } else {
            if (xhr.status === 400) {
              this.statusService.publishError('Please select Program type');
            } else {
              // console.log('xhr', xhr);
              this.statusService.publishError('Unknown Error');
            }
          }
        }

      }
    };
    xhr.send(params);
  }
}*/
}
