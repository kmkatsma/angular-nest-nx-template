import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ocw-loading',
  styleUrls: ['./loading.component.css'],
  template: `
    <div class="overlay">
      <div><mat-spinner class="spinner" color="accent"></mat-spinner></div>
    </div>
  `,
})
export class LoadingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
