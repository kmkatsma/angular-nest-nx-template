import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'ocw-toolbar-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-toolbar color="primary">
      <mat-icon>{{ iconName }}</mat-icon>
      <div style="margin-right:12px"></div>
      <span>{{ title }}</span>
    </mat-toolbar>
  `,
})
export class ToolbarTitleComponent implements OnInit {
  @Input() title: string;
  @Input() iconName: string;

  fontSize = 18;

  constructor() {}

  ngOnInit() {}
}
