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
  BaseResourceEnum,
  ReferenceDataInfo,
  BaseAppStateEnum,
  BaseDomainEnum,
} from '@ocw/shared-models';
import {
  AppStoreService,
  DomainStoreService,
  LogService,
  ResourceStoreService,
  SearchStoreService,
} from '@ocw/ui-core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class DataCategory {
  name: string;
  referenceList: ReferenceDataInfo[];
}

@Component({
  selector: 'ocw-data-maintenance-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div fxFlex fxLayout="column" style="padding: 8px;">
      <div
        *ngIf="!showDetail"
        fxLayout.xs="column"
        fxLayout="row wrap"
        fxLayoutGap="8px"
      >
        <mat-card
          *ngFor="let item of referenceDataList"
          fxFlex.sm="0 1 calc(50%-10px)"
          fxFlex.md="0 1 calc(33%-10px)"
          fxFlex.gt-md="0 1 calc(25%-10px)"
          class="mat-card-row"
          style="cursor: pointer;"
          (click)="go(item)"
        >
          <ocw-card-title
            [titleText]="item.displayName"
            [iconName]="item.icon"
            [subTitleText]="item.description"
          ></ocw-card-title>
        </mat-card>
      </div>
      <div style="height: 100%;">
        <div *ngIf="showDetail">
          <button color="primary" mat-button (click)="back()">
            BACK TO LIST
          </button>
        </div>
        <div style="margin-top: 8px;"></div>
        <ocw-reference-data-list
          *ngIf="dataInfo && !dataInfo.isDocument"
          [data]="data$ | async"
          [dataInfo]="dataInfo"
          [includeInactive]="includeInactive"
        >
        </ocw-reference-data-list>
        <ocw-document-list
          *ngIf="dataInfo && dataInfo.isDocument"
          [useRoute]="dataInfo.componentRoute"
          [data]="data$ | async"
          [dataInfo]="dataInfo"
          [submitAction]="false"
          [filter]="false"
          (updates)="handleUpdate($event)"
        >
        </ocw-document-list>
      </div>
    </div>
  `,
})
export class DataMaintenanceListComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() referenceDataList: ReferenceDataInfo[];
  @Input() attributeType: string;
  @Input() referenceLists: DataCategory[];

  form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  dataInfo: ReferenceDataInfo;
  includeInactive = false;
  data$: Observable<any>;
  showDetail = false;

  constructor(
    private logService: LogService,
    private formBuilder: FormBuilder,
    public domainService: DomainStoreService,
    public resourceService: ResourceStoreService,
    public appStoreService: AppStoreService,
    public searchService: SearchStoreService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.form
      .get('group')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val: string) => {
        this.dataInfo = this.referenceDataList.find(
          (p) => p.displayName === val
        );
        this.logService.log(
          'data Info setting data$',
          this.dataInfo.domainEnum
        );
        this.data$ = this.domainService.Domain$(this.dataInfo.domainEnum);
      });

    this.form
      .get('includeInactive')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.includeInactive = val;
        const group = this.form.controls['group'].value;
        this.dataInfo = this.referenceDataList.find(
          (p) => p.displayName === group
        );
        this.logService.log('data Info', this.dataInfo);
        this.data$ = this.domainService.Domain$(this.dataInfo.domainEnum);
      });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.referenceDataList && this.referenceDataList) {
      this.dataInfo = undefined;
    }
    if (simpleChanges.attributeType) {
      if (this.attributeType && this.attributeType.length > 0) {
        this.showDetail = true;
      } else {
        this.showDetail = false;
      }
      console.log(
        'list attribute changed, detail',
        this.attributeType,
        this.showDetail
      );
    }
    if (simpleChanges.attributeType || simpleChanges.referenceDataList) {
      this.logService.log(
        'DataMaintenanceListComponent setting data$',
        this.dataInfo,
        this.referenceDataList,
        this.attributeType
      );
      if (this.attributeType && this.referenceDataList) {
        this.dataInfo = this.referenceDataList.find(
          (p) => p.domainAttributeName === this.attributeType
        );
        if (this.dataInfo) {
          if (this.dataInfo.searchEnum) {
            this.data$ = this.searchService.Searche$(this.dataInfo.searchEnum);
          } else {
            this.data$ = this.domainService.Domain$(this.dataInfo.domainEnum);
          }
        }
      }
    }
    this.logService.log(
      'DataMaintenanceListComponent changes dataInfo, refDataList, attributeType',
      this.dataInfo,
      this.referenceDataList,
      this.attributeType
    );
  }

  ngOnDestroy() {
    this.appStoreService.setState('', BaseAppStateEnum.ManageDataDomainEnum);
    this.resourceService.clearResourceDataSlot(
      BaseResourceEnum.ReferenceEntity
    );
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      group: ['', Validators.required],
      includeInactive: [''],
    });
  }

  back() {
    this.showDetail = true;
    this.appStoreService.setState('', BaseAppStateEnum.ManageDataDomainEnum);
    this.dataInfo = undefined;
  }

  go(referenceInfo: ReferenceDataInfo) {
    this.showDetail = false;
    this.appStoreService.setState(
      referenceInfo.domainAttributeName,
      BaseAppStateEnum.ManageDataDomainEnum
    );
    this.dataInfo = referenceInfo;
    /*  this.referenceDataList.find(
      p => p.domainAttributeName === referenceInfo.domainAttributeName
    );*/
    this.logService.log('data Info', this.dataInfo);
    this.data$ = this.domainService.Domain$(this.dataInfo.domainEnum);
  }

  handleUpdate(event: any) {
    this.logService.log('event', event);
  }
}
