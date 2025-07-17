import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationResults } from './validation-results';

describe('ValidationResults', () => {
  let component: ValidationResults;
  let fixture: ComponentFixture<ValidationResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
