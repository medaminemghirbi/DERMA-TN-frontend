import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DokumentsComponent } from './dokuments.component';

describe('DokumentsComponent', () => {
  let component: DokumentsComponent;
  let fixture: ComponentFixture<DokumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DokumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DokumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
