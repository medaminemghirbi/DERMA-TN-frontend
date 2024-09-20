import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningDoctorComponent } from './planning-doctor.component';

describe('PlanningDoctorComponent', () => {
  let component: PlanningDoctorComponent;
  let fixture: ComponentFixture<PlanningDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
