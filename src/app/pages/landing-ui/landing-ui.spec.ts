import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingUi } from './landing-ui';

describe('LandingUi', () => {
  let component: LandingUi;
  let fixture: ComponentFixture<LandingUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
