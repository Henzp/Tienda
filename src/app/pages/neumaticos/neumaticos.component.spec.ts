import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeumaticosComponent } from './neumaticos.component';

describe('NeumaticosComponent', () => {
  let component: NeumaticosComponent;
  let fixture: ComponentFixture<NeumaticosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeumaticosComponent]
    });
    fixture = TestBed.createComponent(NeumaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
