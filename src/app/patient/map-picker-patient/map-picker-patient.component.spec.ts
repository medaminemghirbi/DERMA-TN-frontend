import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPickerPatientComponent } from './map-picker-patient.component';

describe('MapPickerPatientComponent', () => {
  let component: MapPickerPatientComponent;
  let fixture: ComponentFixture<MapPickerPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPickerPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPickerPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
