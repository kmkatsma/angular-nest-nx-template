import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ocw-container-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-drawer-container id="drawer-container" style="height:100%">
      <mat-drawer
        class="drawer"
        style="width:100%;height:100%"
        [(opened)]="opened"
        position="end"
        mode="over"
      >
        <ng-content select="[drawer]"></ng-content>
      </mat-drawer>
      <mat-drawer-content style="height:100%">
        <div fxLayout="column" style="height: 100%">
          <ocw-toolbar-title
            *ngIf="toolbarTitle"
            [title]="toolbarTitle"
            [iconName]="iconName"
          ></ocw-toolbar-title>
          <ng-content select="[content]"></ng-content>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class ContainerPageComponent {
  @Input() opened = false;
  @Input() toolbarTitle: string;
  @Input() iconName: string;

  constructor() {}
}
