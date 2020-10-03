import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BaseDomainEnum,
  BaseDomainEnumMap,
  BaseDomainEnumMessageTypeMap,
  BaseSearchEnum,
  TenantDocument,
  UserInfoDocument,
} from '@ocw/shared-models';
import {
  AdminService,
  DomainStoreService,
  LogService,
  SearchStoreService,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FORM_MODE } from '../../../forms/enums';
import { UserAdminService } from '../user-admin.service';
import { userColumns } from './user-list.config';

@Component({
  selector: 'ocw-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ocw-container-page
      [opened]="opened"
      toolbarTitle="User Management"
      iconName="face"
    >
      <ocw-user-edit
        drawer
        *ngIf="opened"
        [allowEdit]="adminService.hasPermission$(UserAdmin) | async"
        [mode]="mode"
        [user]="selectedItem"
        [systemReferenceData]="systemReference$ | async"
        (formEvent)="close()"
      ></ocw-user-edit>
      <div style="margin:8px" content>
        <mat-card *ngIf="showTenantFilter">
          <ocw-autocomplete-value
            *ngIf="tenants"
            [style]="{ 'min-width.px': 250 }"
            placeHolder="Tenant"
            [listData]="tenants"
            [required]="true"
            [formGroup]="form"
            controlName="tenant"
            valueProperty="id"
          ></ocw-autocomplete-value>
          <button mat-raised-button color="primary" (click)="search()"></button>
        </mat-card>
        <ocw-data-table
          [showAddButton]="true"
          pageSize="10"
          (itemSelected)="itemSelected($event)"
          [columns]="columns"
          [checkbox]="false"
          [data]="userAdminService.user$ | async"
          [filter]="true"
          [transformData]="false"
          (addClicked)="addItem()"
        ></ocw-data-table>
      </div>
    </ocw-container-page>
  `,
})
export class UserListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() allowEdit = true;
  @Input() showTenantFilter = false;
  @Input() tenants: TenantDocument[];

  form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  opened = false;
  columns = userColumns;
  loaded = false;
  UserAdmin = 1;
  selectedItem: UserInfoDocument;
  mode: FORM_MODE.ADD | FORM_MODE.UPDATE;
  systemReference$ = this.domainService.Domain$(BaseDomainEnum.SystemReference);

  constructor(
    private logService: LogService,
    public domainService: DomainStoreService,
    public userAdminService: UserAdminService,
    public searchService: SearchStoreService,
    public adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      tenant: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {
    if (!this.showTenantFilter) {
      this.domainService.loadDomains(
        BaseDomainEnum.SystemReference,
        BaseDomainEnumMap[BaseDomainEnum.SystemReference],
        BaseDomainEnumMessageTypeMap[BaseDomainEnum.SystemReference]
      );
    }
    if (!this.loaded && !this.showTenantFilter) {
      this.userAdminService.searchUsers();
      this.loaded = true;
    }

    this.userAdminService.userUpdate$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.opened = false;
        this.userAdminService.searchUsers();
      });
  }

  ngOnDestroy() {
    this.searchService.setSearchData([], BaseSearchEnum.User);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addItem() {
    this.logService.log('opened', this.opened);
    this.opened = true;
    this.mode = FORM_MODE.ADD;
    this.selectedItem = new UserInfoDocument();
  }

  itemSelected(selectedItem: any) {
    this.logService.log('opened', selectedItem, this.opened);
    this.opened = true;
    this.mode = FORM_MODE.UPDATE;
    this.selectedItem = selectedItem.document;
  }

  close() {
    this.opened = false;
  }

  search() {
    if (this.form.controls['tenant'].value) {
      this.userAdminService.searchUsers(this.form.controls['tenant'].value);
    }
  }
}
