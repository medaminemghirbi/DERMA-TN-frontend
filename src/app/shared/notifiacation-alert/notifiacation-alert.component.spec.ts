import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifiacationAlertComponent } from './notifiacation-alert.component';

describe('NotifiacationAlertComponent', () => {
  let component: NotifiacationAlertComponent;
  let fixture: ComponentFixture<NotifiacationAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifiacationAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifiacationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
