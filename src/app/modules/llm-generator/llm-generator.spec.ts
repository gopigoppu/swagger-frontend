import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmGenerator } from './llm-generator';

describe('LlmGenerator', () => {
  let component: LlmGenerator;
  let fixture: ComponentFixture<LlmGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlmGenerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlmGenerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
