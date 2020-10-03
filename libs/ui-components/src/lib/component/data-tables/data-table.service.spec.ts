/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataTableService } from './data-table.service';

describe('Service: DataTable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataTableService]
    });
  });

  it('should ...', inject([DataTableService], (service: DataTableService) => {
    expect(service).toBeTruthy();
  }));
});
