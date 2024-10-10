import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPatientSettingsComponent } from './header-patient-settings.component';

describe('HeaderPatientSettingsComponent', () => {
  let component: HeaderPatientSettingsComponent;
  let fixture: ComponentFixture<HeaderPatientSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderPatientSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPatientSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
