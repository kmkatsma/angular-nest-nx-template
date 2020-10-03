import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuthService, SearchStoreService } from '@ocw/ui-core';

@Component({
  selector: 'ocw-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-tab-group
      #tabGroup
      backgroundColor="primary"
      color="accent"
      dynamicHeight="false"
      style="margin-left:3px;position:relative;"
      style="z-index:-10"
      (selectedTabChange)="tabChanged($event)"
    >
      <mat-tab>
        <ng-template mat-tab-label>
          <div>SUMMARY INFO</div>
        </ng-template>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class DashboardComponent implements OnInit {
  public opened = false;
  tabIndex = 0;

  constructor(
    public authService: AuthService,
    public searchStore: SearchStoreService
  ) {}

  ngOnInit() {}

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabIndex = tabChangeEvent.index;
  }
}
