import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuantesComponent } from './guantes.component';

describe('GuantesComponent', () => {
  let component: GuantesComponent;
  let fixture: ComponentFixture<GuantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuantesComponent]
    });
    fixture = TestBed.createComponent(GuantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
