import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPatientComponent } from './settings-patient.component';

describe('SettingsPatientComponent', () => {
  let component: SettingsPatientComponent;
  let fixture: ComponentFixture<SettingsPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
