import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwaggerPreview } from './swagger-preview';

describe('SwaggerPreview', () => {
  let component: SwaggerPreview;
  let fixture: ComponentFixture<SwaggerPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwaggerPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwaggerPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
