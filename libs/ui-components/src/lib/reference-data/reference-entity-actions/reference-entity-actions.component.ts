import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  LogService,
  ResourceStoreService,
  StatusStoreService,
  AppStoreService,
} from '@ocw/ui-core';
import {
  ReferenceItem,
  BaseResourceEnum,
  BaseAppStateEnum,
  ReferenceDataInfo,
} from '@ocw/shared-models';
import { ReferenceDataService } from '../reference-data.service';
import { FORM_MODE } from '../../forms/enums';
import { ValidatorService } from '../../forms/validator.service';

@Component({
  selector: 'ocw-reference-entity-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="margin-top: 8px" fxLayout="row">
      <button
        [disabled]="!allowEdit"
        type="button"
        color="primary"
        mat-raised-button
        (click)="save()"
      >
        SAVE
      </button>
      <div style="margin: 4px"></div>
      <button type="button" color="primary" mat-button (click)="cancel()">
        CANCEL
      </button>
    </div>
  `,
})
export class ReferenceEntityActionsComponent implements OnInit {
  @Input() allowEdit = true;
  @Input() form: FormGroup;
  @Input() item: ReferenceItem;
  @Input() mode: FORM_MODE;
  @Input() referenceDataInfo: ReferenceDataInfo;
  @Output() cancelled: EventEmitter<void> = new EventEmitter();

  constructor(
    private appStateService: AppStoreService,
    private statusService: StatusStoreService,
    private resourceService: ResourceStoreService,
    private validatorService: ValidatorService,
    private referenceDataService: ReferenceDataService,
    private logService: LogService
  ) {}

  ngOnInit() {}

  isValid(): boolean {
    this.validatorService.triggerFormValidation(this.form);
    return this.form.valid;
  }

  save() {
    if (this.isValid()) {
      this.logService.log(
        'Item before update:',
        this.item,
        this.referenceDataInfo
      );
      if (!this.referenceDataInfo.resourceEnum) {
        this.statusService.publishError('Missing Resource Enum for Save');
        return;
      }
      let clone = new ReferenceItem();
      clone = Object.assign({}, this.item, this.form.getRawValue());
      const request = this.referenceDataService.createSaveRequest(
        this.mode,
        clone,
        this.referenceDataInfo
      );
      this.logService.log('request', request);
      this.resourceService.executeServiceRequest(
        request,
        this.referenceDataInfo.resourceEnum
      );
    } else {
      this.statusService.publishError('Please fix validation errors');
    }
  }

  cancel() {
    this.cancelled.emit();
    this.appStateService.setState({ opened: false }, BaseAppStateEnum.FormOpen);
  }
}
