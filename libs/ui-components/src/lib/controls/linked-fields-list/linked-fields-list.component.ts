import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LinkedFields } from '../../forms/form-control.service';

@Component({
  selector: 'ocw-linked-fields-list',
  templateUrl: './linked-fields-list.component.html',
  styleUrls: ['./linked-fields-list.component.css'],
})
export class LinkedFieldsListComponent implements OnInit {
  @Input() item: LinkedFields;
  @Input() formGroup: FormGroup;

  constructor() {}

  ngOnInit() {}
}
