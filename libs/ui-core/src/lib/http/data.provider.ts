import { HttpService } from './http.service';
import { BaseDataService } from './base-data.service';
import { MockBaseDataService } from './mock-base-data.service';
import { HttpClient } from '@angular/common/http';
import { LogService } from '../logging/log.service';
import { Environment } from '../environment/environment';

/* Constituent SERVICE PROVIDER */
export function BaseDataServiceFactory(
  httpService: HttpService,
  logService: LogService,
  environmentService: Environment
) {
  // Return mock when mock option is specified
  if (environmentService.useMockData === true) {
    return new MockBaseDataService(httpService, logService);
  } else {
    return new BaseDataService(httpService, logService);
  }
}

export let BaseDataServiceProvider = {
  provide: BaseDataService,
  useFactory: BaseDataServiceFactory,
  deps: [HttpService, LogService, Environment],
};
