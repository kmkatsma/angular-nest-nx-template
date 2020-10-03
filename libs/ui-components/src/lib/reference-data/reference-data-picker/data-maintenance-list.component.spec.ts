/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataMaintenanceListComponent } from './data-maintenance-list.component';

describe('DataMaintenanceListComponent', () => {
  let component: DataMaintenanceListComponent;
  let fixture: ComponentFixture<DataMaintenanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataMaintenanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMaintenanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
