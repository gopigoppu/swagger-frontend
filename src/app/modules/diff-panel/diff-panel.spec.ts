import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffPanel } from './diff-panel';

describe('DiffPanel', () => {
  let component: DiffPanel;
  let fixture: ComponentFixture<DiffPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
