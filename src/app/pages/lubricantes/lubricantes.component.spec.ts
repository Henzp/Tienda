import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricantesComponent } from './lubricantes.component';

describe('LubricantesComponent', () => {
  let component: LubricantesComponent;
  let fixture: ComponentFixture<LubricantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LubricantesComponent]
    });
    fixture = TestBed.createComponent(LubricantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
