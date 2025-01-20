import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcoursAcademiqueComponent } from './parcours-academique.component';

describe('ParcoursAcademiqueComponent', () => {
  let component: ParcoursAcademiqueComponent;
  let fixture: ComponentFixture<ParcoursAcademiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcoursAcademiqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcoursAcademiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
