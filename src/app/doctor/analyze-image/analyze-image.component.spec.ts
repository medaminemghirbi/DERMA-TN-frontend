import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeImageComponent } from './analyze-image.component';

describe('AnalyzeImageComponent', () => {
  let component: AnalyzeImageComponent;
  let fixture: ComponentFixture<AnalyzeImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyzeImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyzeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
