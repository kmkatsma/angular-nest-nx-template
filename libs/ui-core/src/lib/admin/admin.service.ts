import { Injectable } from '@angular/core';
import { BaseDomainEnum, SystemReferenceData } from '@ocw/shared-models';

import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { AuthService } from '../auth/auth.service';
import { LogService } from '../logging/log.service';
import { DomainStoreService } from '../state/store-services/domain-store.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private logService: LogService,
    private authService: AuthService,
    private domainService: DomainStoreService
  ) {}

  hasPermission$(permission: number): Observable<boolean> {
    return this.domainService.Domain$(BaseDomainEnum.SystemReference).pipe(
      map((x: SystemReferenceData) => {
        return this.authService.hasPermission(permission, x.permissions);
      })
    );
  }
}
