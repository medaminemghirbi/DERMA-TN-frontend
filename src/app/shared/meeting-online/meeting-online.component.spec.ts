import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingOnlineComponent } from './meeting-online.component';

describe('MeetingOnlineComponent', () => {
  let component: MeetingOnlineComponent;
  let fixture: ComponentFixture<MeetingOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingOnlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
