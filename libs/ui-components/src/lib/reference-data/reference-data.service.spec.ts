/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReferenceDataService } from './reference-data.service';

describe('Service: ReferenceData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferenceDataService]
    });
  });

  it('should ...', inject([ReferenceDataService], (service: ReferenceDataService) => {
    expect(service).toBeTruthy();
  }));
});
