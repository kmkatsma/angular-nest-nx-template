import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

export class CardTitleComponentButton {
  toolTip: string;
  callback: () => unknown;
  icon: string;
}

@Component({
  selector: 'ocw-card-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card-header fxLayout="row">
      <div mat-card-avatar>
        <mat-icon
          [ngStyle]="{ 'font-size': fontSize + 'px' }"
          color="primary"
          >{{ iconName }}</mat-icon
        >
      </div>
      <mat-card-title fxLayout="row">
        <div>{{ titleText }}</div>
      </mat-card-title>
      <mat-card-subtitle>{{ subTitleText }}</mat-card-subtitle>
      <div fxFlex></div>
      <button
        *ngFor="let button of buttons"
        mat-icon-button
        style="color:gray; margin-top:-12px"
        [matTooltip]="button.toolTip"
        (click)="button.callback()"
      >
        <mat-icon>{{ button.icon }}</mat-icon>
      </button>
    </mat-card-header>
  `,
})
export class CardTitleComponent implements OnInit {
  @Input() iconName: string;
  @Input() titleText: string;
  @Input() subTitleText: string;
  @Input() buttons: CardTitleComponentButton[] = [];

  fontSize = 40;

  constructor() {}

  ngOnInit() {}

  fullScreen() {}
}
