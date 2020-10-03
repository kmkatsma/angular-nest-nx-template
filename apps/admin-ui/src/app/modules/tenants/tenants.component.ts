import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ResourceStoreService } from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { BaseResourceEnum, TenantDocument } from '@ocw/shared-models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ocw-tenants',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ocw-container-page
      toolbarTitle="Tenants"
      iconName="payment"
      [opened]="opened"
    >
      <ocw-tenant-edit
        *ngIf="opened"
        drawer
        [tenantRecord]="selectedTenant"
        (cancelled)="onClosed()"
      ></ocw-tenant-edit>
      <ocw-tenant-search
        content
        (itemSelected)="handleItemSelected($event)"
        (addClicked)="handleAddClicked()"
        [loadTrigger]="loadTrigger"
      ></ocw-tenant-search>
    </ocw-container-page>
  `,
})
export class TenantsComponent implements OnInit, OnDestroy {
  ngUnsubscribe: Subject<void> = new Subject<void>();
  opened = false;
  selectedTenant: TenantDocument;
  loadTrigger = undefined;

  constructor(
    public resourceService: ResourceStoreService,
    public cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.resourceService
      .ResourceSave$(BaseResourceEnum.Tenant)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        console.log('resource save');
        this.opened = false;
        this.loadTrigger = !this.loadTrigger;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  handleItemSelected(item: TenantDocument) {
    this.opened = true;
    this.selectedTenant = item;
  }

  handleAddClicked() {
    this.selectedTenant = new TenantDocument();
    this.opened = true;
  }

  onClosed() {
    this.opened = false;
  }
}
