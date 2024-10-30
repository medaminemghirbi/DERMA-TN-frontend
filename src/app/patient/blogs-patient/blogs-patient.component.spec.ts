import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsPatientComponent } from './blogs-patient.component';

describe('BlogsPatientComponent', () => {
  let component: BlogsPatientComponent;
  let fixture: ComponentFixture<BlogsPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
