import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CloneUtil } from '@ocw/shared-core';
import {
  BaseAppStateEnum,
  BaseResourceEnum,
  ReferenceAttributeType,
  ReferenceItem,
  ReferenceItemAttribute,
  ReferenceValueAttribute,
  ReferenceDataInfo,
} from '@ocw/shared-models';
import {
  AppStoreService,
  LogService,
  ReferenceDataUtil,
  ResourceStoreService,
  StatusStoreService,
} from '@ocw/ui-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FORM_MODE } from '../../forms/enums';
import { ValidatorService } from '../../forms/validator.service';
import { ReferenceDataService } from '../reference-data.service';

@Component({
  selector: 'ocw-reference-entity-edit-base',
  templateUrl: './reference-entity-edit-base.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferenceEntityEditBaseComponent implements OnInit, OnDestroy {
  public ngUnsubscribe: Subject<void> = new Subject<void>();
  title: string;
  selectedItem: ReferenceItem;
  referenceData: ReferenceDataInfo;
  mode: FORM_MODE;
  form: FormGroup;
  ReferenceValueAttribute = ReferenceValueAttribute;
  ReferenceItemAttribute = ReferenceItemAttribute;
  ReferenceAttributeType = ReferenceAttributeType;
  ReferenceDataUtil = ReferenceDataUtil;

  constructor(
    public logService: LogService,
    public appStateService: AppStoreService,
    public resourceService: ResourceStoreService,
    public referenceDataService: ReferenceDataService,
    public statusService: StatusStoreService,
    public validatorService: ValidatorService
  ) {}

  ngOnInit() {
    this.resourceService
      .Resource$(BaseResourceEnum.ReferenceEntity)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val: ReferenceItem) => {
        this.selectedItem = CloneUtil.cloneDeep(val);
        this.logService.log('selectedItem', this.selectedItem);
        if (val.id === undefined) {
          this.mode = FORM_MODE.ADD;
        } else {
          this.mode = FORM_MODE.UPDATE;
        }
        this.populateForm(this.selectedItem);
        //this.cd.markForCheck();
      });

    this.appStateService
      .AppState$(BaseAppStateEnum.ReferenceDataInfo)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val: ReferenceDataInfo) => {
        this.logService.log('referenceDataInfo', val);
        this.referenceData = val;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createForm(formGroup: FormGroup) {
    this.form = formGroup;
  }

  setTitle(title: string) {
    this.title = title;
  }

  public isValid(form: FormGroup): boolean {
    this.validatorService.triggerFormValidation(form);
    return form.valid;
  }

  save() {
    if (this.isValid(this.form)) {
      this.logService.log('Item before update:', this.selectedItem);
      let clone = new ReferenceItem();
      clone = Object.assign({}, this.selectedItem, this.form.getRawValue());
      this.referenceDataService.saveReferenceData(
        this.mode,
        clone,
        this.referenceData
      );
    } else {
      this.statusService.publishError('Please fix validation errors');
    }
  }

  populateForm(item: ReferenceItem) {
    this.logService.log('populate form', item);
    this.form.reset({}, { emitEvent: false });
    this.form.patchValue(Object.assign({}, item));
    this.logService.log('form values, servicetype', this.form.value, item);
  }

  cancel() {
    this.appStateService.setState({ opened: false }, BaseAppStateEnum.FormOpen);
  }
}
