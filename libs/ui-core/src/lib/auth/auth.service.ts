import { Injectable } from '@angular/core';
import { CloneUtil } from '@ocw/shared-core';
import {
  BaseAppStateEnum,
  BaseResourceEnum,
  BaseSecurityRoleEnum,
  PermissionedItem,
  PermissionItem,
  UserInfoDocument,
  UserMessageTypes,
} from '@ocw/shared-models';
import { Observable } from 'rxjs';
import { LogService } from '../logging/log.service';
import { AppStoreService } from '../state/store-services/app-store.service';
import { ResourceStoreService } from '../state/store-services/resource-store-service';

export enum PermissionItemType {
  Menu = 1,
  System = 2,
}

@Injectable()
export class AuthService {
  redirectUrl: string;
  currentUser: UserInfoDocument = new UserInfoDocument();
  userLoginFail$: Observable<any>;
  currentUser$: Observable<UserInfoDocument>;
  userLogin$: Observable<UserInfoDocument>;
  systemUserLoaded$: Observable<boolean>;

  constructor(
    private logService: LogService,
    private resourceservice: ResourceStoreService,
    private appStoreService: AppStoreService
  ) {
    this.resourceservice
      .Resource$(BaseResourceEnum.CurrentUser)
      .subscribe((res) => {
        if (res) {
          // console.log('current user set', res);
          this.currentUser = res;
          this.appStoreService.setState(
            true,
            BaseAppStateEnum.SystemUserLoaded
          );
        }
      });

    this.userLoginFail$ = this.resourceservice.ResourceGetFail$(
      BaseResourceEnum.CurrentUser
    );
    this.userLogin$ = this.resourceservice.Resource$(
      BaseResourceEnum.CurrentUser
    );

    this.systemUserLoaded$ = this.appStoreService.AppState$(
      BaseAppStateEnum.SystemUserLoaded
    );
  }

  loadUser() {
    console.log('load user');
    this.resourceservice.executeGetRequest(
      '',
      BaseResourceEnum.CurrentUser,
      UserMessageTypes.UserGetCurrent
    );
  }

  getState(): string {
    return this.currentUser.tenantState;
  }

  hasPermission(permission: number, permissions: PermissionItem[]) {
    if (!permissions) {
      console.log('missing permissions');
      return false;
    }
    console.log('has permissions', permission, permissions);
    const permissionedItem = permissions.find((p) => p.uid === permission);
    return this.hasAccess(permissionedItem);
  }

  /*hasPermission$(
    permission: number,
    permissions: PermissionItem[]
  ): Observable<boolean> {
    if (!permissions) {
      return of(false);
    }
    const permissionedItem = permissions.find((p) => p.uid === permission);
    return this.hasAccess$(permissionedItem);
  }*/

  hasTenantAccess(permissionedItem: PermissionedItem) {
    console.log(
      'hasTenantAccess',
      permissionedItem.tenantFeatureId,
      this.currentUser
    );
    if (permissionedItem.tenantFeatureId) {
      if (!this.currentUser || !this.currentUser.tenantFeatures) {
        console.log('hasTenantAccess false no user');
        return false;
      }
      if (
        this.currentUser.tenantFeatures.indexOf(
          permissionedItem.tenantFeatureId
        ) >= 0
      ) {
        return true;
      }
      console.log('hasTenantAccess false no feature match');
      return false;
    }
    return true;
  }

  hasAccess(permissionedItem: PermissionedItem) {
    this.logService.log('hasAccess', permissionedItem, this.currentUser);
    if (!permissionedItem || !this.currentUser || !this.currentUser.roles) {
      return false;
    }
    if (
      !permissionedItem.allowedRoles ||
      permissionedItem.allowedRoles.length === 0
    ) {
      return true;
    }
    const allowedRoles: number[] = CloneUtil.cloneDeep(
      permissionedItem.allowedRoles
    );
    allowedRoles.push(BaseSecurityRoleEnum.Admin);

    const intersection = this.currentUser.roles.filter((value) =>
      allowedRoles.includes(value)
    );
    if (intersection.length > 0) {
      return true;
    }
    return false;
  }

  /* hasAccess$(permissionedItem: PermissionedItem): Observable<boolean> {
    this.logService.log('hasAccess', permissionedItem, this.currentUser);
    if (!permissionedItem) {
      return of(false);
    }
    if (
      !permissionedItem.allowedRoles ||
      permissionedItem.allowedRoles.length === 0
    ) {
      return of(true);
    }
    const allowedRoles: number[] = CloneUtil.cloneDeep(
      permissionedItem.allowedRoles
    );
    allowedRoles.push(SecurityRoleEnum.Admin);

    return this.currentUser$.pipe(
      map((x: UserInfoDocument) => {
        const intersection = x.roles.filter((value) =>
          allowedRoles.includes(value)
        );
        if (intersection.length > 0) {
          return true;
        }
        return false;
      })
    );
  }*/

  hasRole(requiredRoles: number[]) {
    if (!requiredRoles || !this.currentUser || !this.currentUser.roles) {
      return false;
    }
    if (requiredRoles.length === 0) {
      return true;
    }
    const allowedRoles: number[] = CloneUtil.cloneDeep(requiredRoles);
    allowedRoles.push(BaseSecurityRoleEnum.Admin);
    const intersection = this.currentUser.roles.filter((value) =>
      allowedRoles.includes(value)
    );
    if (intersection.length > 0) {
      return true;
    }
    return false;
  }
}
