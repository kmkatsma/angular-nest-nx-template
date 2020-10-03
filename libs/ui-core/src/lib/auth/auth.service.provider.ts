import { AuthService } from './auth.service';
import { MockAuthService } from './mock.auth.service';
import { EventsService } from '../events/events.service';
//import { AdalService } from 'adal-angular4';
import { LogService } from '../logging/log.service';
import { ResourceStoreService } from '../state/store-services/resource-store-service';
import { Router } from '@angular/router';
import { AppStoreService } from '../state/store-services/app-store.service';
import { DomainStoreService } from '../state/store-services/domain-store.service';

/*export function authServiceFactory(
  environmentService: EnvironmentService,
  eventService: EventsService,
  adalService: AdalService,
  logService: LogService,
  resourceService: ResourceStoreService,
  appStoreService: AppStoreService,
  domainService: DomainStoreService,
  router: Router
) {
  // TODO: actually implement authentication =)
  // if (environmentService.isProduction === false) {
  return new AuthService(
    logService,
    resourceService,
    appStoreService,
    domainService,
    router
  );
  // } else {
  //   return new AuthService(environmentService, oAuthService);
  // }
}*/

/*export let AuthServiceProvider = {
  provide: AuthService,
  useFactory: authServiceFactory,
  deps: [EnvironmentService, EventsService]
};*/
