import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppStoreService } from '@ocw/ui-core';
import { BaseAppStateEnum } from '@ocw/shared-models';

export class LocationInfo {
  name: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  primaryLocation$: Observable<LocationInfo>;
  secondaryLocation$: Observable<LocationInfo>;
  constructor(private readonly appStoreService: AppStoreService) {
    this.primaryLocation$ = this.appStoreService.AppState$(
      BaseAppStateEnum.PrimaryLocation
    );
    this.secondaryLocation$ = this.appStoreService.AppState$(
      BaseAppStateEnum.SecondaryLocation
    );
  }

  setLocation(name: string, secondary?: string) {
    const loc = new LocationInfo();
    loc.name = name;
    this.appStoreService.setState(loc, BaseAppStateEnum.PrimaryLocation);

    const loc2 = new LocationInfo();
    loc2.name = secondary;
    this.appStoreService.setState(loc2, BaseAppStateEnum.SecondaryLocation);
  }
}
