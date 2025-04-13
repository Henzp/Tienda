import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorPerfilComponent } from './selector-perfil.component';

describe('SelectorPerfilComponent', () => {
  let component: SelectorPerfilComponent;
  let fixture: ComponentFixture<SelectorPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectorPerfilComponent]
    });
    fixture = TestBed.createComponent(SelectorPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
