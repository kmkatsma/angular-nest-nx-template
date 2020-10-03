import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService, AppStoreService } from '@ocw/ui-core';
import { takeUntil } from 'rxjs/operators';
import { BaseAppStateEnum } from '@ocw/shared-models';

export class ReportTypeDefinition {
  route: string;
  name: string;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'ocw-report-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ocw-content-page-wrapper [title]="title" iconName="list_alt">
      <div fxFlex fxLayout="column" style="padding:8px">
        <div *ngIf="showReportDetail">
          <button color="primary" mat-button (click)="back()">
            BACK TO ALL REPORTS
          </button>
        </div>
        <div
          *ngIf="!showReportDetail"
          fxLayout.xs="column"
          fxLayout="row wrap"
          fxLayoutGap="8px"
        >
          <mat-card
            *ngFor="let item of reportList"
            fxFlex.sm="0 1 calc(50%-10px)"
            fxFlex.md="0 1 calc(33%-10px)"
            fxFlex.gt-md="0 1 calc(25%-10px)"
            class="mat-card-row"
            style="cursor:pointer"
            (click)="go(item.route)"
          >
            <ocw-card-title
              [titleText]="item.name"
              [iconName]="item.icon"
              [subTitleText]="item.description"
            ></ocw-card-title>
          </mat-card>
        </div>
        <div style="margin-top:8px"></div>
        <router-outlet></router-outlet>
        <ng-content></ng-content>
      </div>
    </ocw-content-page-wrapper>
  `,
})
export class ReportListComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() rootPath: string;
  @Input() reportList: ReportTypeDefinition[];
  @Input() emitEvent = false;
  form: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  showReportDetail = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private logService: LogService,
    private appStoreService: AppStoreService
  ) {
    // this.createForm();
  }

  ngOnInit() {
    /* this.form
      .get('report')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(val => {
        this.logService.log('navigating to', val);
        this.router.navigate([val], {
          relativeTo: this.route
        });
      });*/
  }

  ngOnDestroy() {
    this.showReportDetail = false;
    if (!this.emitEvent) {
      this.appStoreService.setState('', BaseAppStateEnum.ReportSelected);
    }
  }

  /*private createForm() {
    this.form = this.formBuilder.group({
      report: ['', Validators.required]
    });
  }*/

  back() {
    this.showReportDetail = false;
    if (!this.emitEvent) {
      this.router.navigate([this.rootPath, 'reports']);
    } else {
      this.appStoreService.setState('', BaseAppStateEnum.ReportSelected);
    }
  }

  go(route: string) {
    this.showReportDetail = true;
    if (!this.emitEvent) {
      this.router.navigate([route], {
        relativeTo: this.route,
      });
    } else {
      this.appStoreService.setState(route, BaseAppStateEnum.ReportSelected);
    }
  }
}
