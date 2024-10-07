import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPhoneNumbersComponent } from './my-phone-numbers.component';

describe('MyPhoneNumbersComponent', () => {
  let component: MyPhoneNumbersComponent;
  let fixture: ComponentFixture<MyPhoneNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPhoneNumbersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPhoneNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
