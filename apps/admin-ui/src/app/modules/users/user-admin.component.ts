import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BaseSearchEnum,
  UserInfoDocument,
  UserMessageTypes,
} from '@ocw/shared-models';
import { SearchStoreService } from '@ocw/ui-core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ocw-user-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ocw-user-list
      [showTenantFilter]="true"
      [tenants]="tenant$ | async"
    ></ocw-user-list>
  `,
})
export class UserAdminComponent implements OnInit {
  constructor(private searchService: SearchStoreService) {}

  tenant$: Observable<UserInfoDocument[]>;

  ngOnInit() {
    this.searchService.processMessage(
      {},
      BaseSearchEnum.User,
      UserMessageTypes.Query
    );
    this.tenant$ = this.searchService.Searche$(BaseSearchEnum.User);
  }
}
