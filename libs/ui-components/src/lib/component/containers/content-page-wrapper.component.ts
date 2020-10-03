import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ocw-content-page-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-drawer-container style="height:100%">
      <div fxLayout="column" style="height: 100%">
        <ocw-toolbar-title
          [title]="title"
          [iconName]="iconName"
        ></ocw-toolbar-title>
        <div fxFlex fxLayout="row">
          <div fxFlex fxLayout="column">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </mat-drawer-container>
  `
})
export class ContentPageWrapperComponent {
  @Input() title: string;
  @Input() iconName: string;

  constructor() {}
}
