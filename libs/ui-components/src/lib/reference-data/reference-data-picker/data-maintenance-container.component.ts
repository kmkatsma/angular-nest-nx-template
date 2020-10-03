import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AppStoreService,
  LogService,
  ReferenceDataInfoGroup,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ReferenceDataInfo, BaseAppStateEnum } from '@ocw/shared-models';

@Component({
  selector: 'ocw-data-maintenance-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form">
      <mat-button-toggle-group
        *ngIf="referenceDataGroups && showToggle"
        formControlName="referenceDataType"
        #group="matButtonToggleGroup"
      >
        <mat-button-toggle
          *ngFor="let item of referenceDataGroups"
          [value]="item.name"
          aria-label="Text align left"
        >
          {{ item.name }}
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <div style="height:100%">
      <ocw-data-maintenance-list
        [attributeType]="
          appStoreService.AppState$(BaseAppStateEnum.ManageDataDomainEnum)
            | async
        "
        [referenceDataList]="referenceDataList"
      ></ocw-data-maintenance-list>
    </div>
  `,
})
export class DataMaintenanceContainerComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() referenceDataGroups: ReferenceDataInfoGroup[];
  @Input() referenceDataList: ReferenceDataInfo[];
  @Input() manageDataEnum: string;

  form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  BaseAppStateEnum = BaseAppStateEnum;
  showToggle = true;

  constructor(
    private logService: LogService,
    public appStoreService: AppStoreService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.form
      .get('referenceDataType')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        if (this.referenceDataGroups) {
          const group = this.referenceDataGroups.find((p) => p.name === val);
          this.referenceDataList = group.referenceDataList;
        }
      });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (
      simpleChanges.referenceDataGroups &&
      this.referenceDataGroups &&
      this.referenceDataGroups.length > 0
    ) {
      this.referenceDataList = this.referenceDataGroups[0].referenceDataList;
      this.form.controls['referenceDataType'].setValue(
        this.referenceDataGroups[0].name
      );
    }
    if (simpleChanges.manageDataEnum) {
      if (this.manageDataEnum === undefined || this.manageDataEnum === null) {
        this.showToggle = true;
      } else {
        if (this.manageDataEnum.length === 0) {
          this.showToggle = true;
        } else {
          this.showToggle = false;
        }
      }
    }
    this.logService.log(
      'data maintenance container changes',
      simpleChanges,
      this.showToggle,
      this.referenceDataList
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createForm() {
    const form = this.formBuilder.group({
      referenceDataType: '',
    });
    return form;
  }
}
