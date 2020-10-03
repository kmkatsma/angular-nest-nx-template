import { async, TestBed } from '@angular/core/testing';
import { AccessModule } from './access.module';

describe('AccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AccessModule).toBeDefined();
  });
});
