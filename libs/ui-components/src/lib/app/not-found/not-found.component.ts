import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ocw-not-found',
  template: ` <div>Oh No, I couldn't find the page!</div> `,
})
export class NotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
