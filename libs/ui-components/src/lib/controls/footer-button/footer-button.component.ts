import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ocw-footer-button',
  templateUrl: './footer-button.component.html',
  styleUrls: ['./footer-button.component.css']
})
export class FooterButtonComponent implements OnInit {
  @Input() icon: string;
  @Input() toolTip: string;
  @Input() isNew: boolean;
  @Output() clicked: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  click() {
    this.clicked.emit(undefined);
  }
}
