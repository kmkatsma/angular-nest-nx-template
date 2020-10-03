import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { LogService } from '@ocw/ui-core';
import { TabMenuItem } from '@ocw/shared-models';

@Component({
  selector: 'ocw-layout-sidebar-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [ngStyle]="{
        'width.px': width,
        'text-align': 'left',
        'padding-left.px': padding,
        'font-size.px': 12
      }"
      [ngClass]="item.active ? 'icon-active' : 'icon-inactive'"
      [matTooltip]="item.toolTip"
      [routerLink]="item.route"
      routerLinkActive="icon-active"
      [routerLinkActiveOptions]="{ exact: false }"
      mat-icon-button
    >
      <mat-icon
        class="icon-inactive"
        routerLinkActive="icon-active"
        [routerLinkActiveOptions]="{ exact: false }"
        [ngClass]="item.active ? 'icon-active' : 'icon-inactive'"
        >{{ item.icon }}</mat-icon
      >
      <span style="margin-left:8px" *ngIf="showText">
        {{ item.toolTip }}
      </span>
    </button>
  `,
  styles: [
    `
      .icon-inactive {
        color: #b0bec5; /* #9ea7aa;  9e9e9e */
      }
      .icon-active {
        color: greenyellow !important;
      }
    `,
  ],
})
export class LayoutSidebarButtonComponent implements OnChanges {
  @Input() width: number;
  @Input() item: TabMenuItem;
  @Input() iconClass: string; //TODO use or remove

  showText = false;
  padding: number;

  constructor(private logService: LogService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.width && this.width) {
      if (this.width > 60) {
        this.showText = true;
        this.padding = 16;
      } else {
        this.showText = false;
        this.padding = 16;
      }
    }
  }
}
