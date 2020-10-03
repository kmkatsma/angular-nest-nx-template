import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseDocument, AuditInfoField } from '@ocw/shared-models';
import { DateFormatter } from '@ocw/ui-core';

@Component({
  selector: 'ocw-audit-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="created" fxLayout="row" fxHide fxShow.gt-xs>
      <div style="margin-left: 16px; font-size: 12px">Created:</div>
      <div class="accent-color" style="margin-left: 4px; font-size: 12px">
        {{ created }}
      </div>
      <div style="margin-left: 16px; font-size: 12px">Updated:</div>
      <div class="accent-color" style="margin-left: 4px; font-size: 12px">
        {{ updated }}
      </div>
    </div>
  `,
})
export class AuditFieldsComponent implements OnChanges {
  @Input() document: BaseDocument;
  created: string;
  updated: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.document && this.document.auditInfo && changes['document']) {
      this.created = this.getAuditString(
        this.document.auditInfo[AuditInfoField.crtBy],
        this.document.auditInfo[AuditInfoField.crtTs]
      );
      this.updated = this.getAuditString(
        this.document.auditInfo[AuditInfoField.updBy],
        this.document.auditInfo[AuditInfoField.updTs]
      );
    }
  }

  private getAuditString(name: string, ts: number) {
    if (!name || !ts) {
      return '';
    }
    const date = DateFormatter.formatDateTime(new Date(ts * 1000));
    return (name.toUpperCase() + ' ' + date).trim();
  }
}
