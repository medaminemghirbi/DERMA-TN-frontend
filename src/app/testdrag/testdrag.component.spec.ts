import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestdragComponent } from './testdrag.component';

describe('TestdragComponent', () => {
  let component: TestdragComponent;
  let fixture: ComponentFixture<TestdragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestdragComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestdragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
