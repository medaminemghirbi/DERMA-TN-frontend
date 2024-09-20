import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorBlogsComponent } from './doctor-blogs.component';

describe('DoctorBlogsComponent', () => {
  let component: DoctorBlogsComponent;
  let fixture: ComponentFixture<DoctorBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorBlogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
