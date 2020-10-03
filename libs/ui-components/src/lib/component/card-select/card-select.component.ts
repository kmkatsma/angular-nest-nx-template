import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { ReferenceDataInfo } from '@ocw/shared-models';

@Component({
  selector: 'ocw-card-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card
      *ngFor="let item of referenceDataList"
      fxFlex.sm="0 1 calc(50%-10px)"
      fxFlex.md="0 1 calc(33%-10px)"
      fxFlex.gt-md="0 1 calc(25%-10px)"
      class="mat-card-row"
      style="cursor:pointer"
      (click)="go(item)"
    >
      <ocw-card-title
        [titleText]="item.displayName"
        [iconName]="item.icon"
        [subTitleText]="item.description"
      ></ocw-card-title>
    </mat-card>
  `
})
export class CardSelectComponent {
  @Input() referenceDataList: ReferenceDataInfo[];
  @Output() itemSelected: EventEmitter<ReferenceDataInfo> = new EventEmitter();

  constructor() {}

  go(referenceInfo: ReferenceDataInfo) {
    this.itemSelected.emit(referenceInfo);
  }
}
