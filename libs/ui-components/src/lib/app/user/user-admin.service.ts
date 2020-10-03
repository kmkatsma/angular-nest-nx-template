import { Injectable } from '@angular/core';
import {
  BaseResourceEnum,
  BaseSearchEnum,
  SaveUserInfoRequest,
  TenantDocument,
  UserInfoDocument,
  UserInfoFilter,
  UserMessageTypes,
  UserProfileDocument,
} from '@ocw/shared-models';
import { ResourceStoreService, SearchStoreService } from '@ocw/ui-core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  public userUpdate$: Observable<UserInfoDocument>;
  public user$: Observable<UserInfoDocument[]>;
  public userProfileUpdate$: Observable<UserProfileDocument>;
  public userProfile$: Observable<UserProfileDocument[]>;
  public tenant$: Observable<TenantDocument[]>;

  constructor(
    private searchService: SearchStoreService,
    private resourceService: ResourceStoreService
  ) {
    this.user$ = this.searchService.Searche$(BaseSearchEnum.User);
    this.userUpdate$ = this.resourceService.ResourceSave$(
      BaseResourceEnum.User
    );
    this.userProfile$ = this.searchService.Searche$(BaseSearchEnum.UserProfile);
    this.userProfileUpdate$ = this.resourceService.ResourceSave$(
      BaseResourceEnum.UserProfile
    );
  }

  searchUsers(tenantId?: string) {
    const request = new UserInfoFilter();
    request.tenantId = tenantId;
    this.searchService.processMessage(
      request,
      BaseSearchEnum.User,
      UserMessageTypes.Query
    );
  }

  saveUser(request: SaveUserInfoRequest) {
    this.resourceService.executeService({
      data: request.data,
      messageType: UserMessageTypes.Mutate,
      action: request.action,
      resourceEnum: BaseResourceEnum.User,
    });
  }
}
