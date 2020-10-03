/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PartnerEditComponent } from './partner-edit.component';

describe('PartnerEditComponent', () => {
  let component: PartnerEditComponent;
  let fixture: ComponentFixture<PartnerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
