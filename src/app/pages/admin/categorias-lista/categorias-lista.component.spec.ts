import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasListaComponent } from './categorias-lista.component';

describe('CategoriasListaComponent', () => {
  let component: CategoriasListaComponent;
  let fixture: ComponentFixture<CategoriasListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriasListaComponent]
    });
    fixture = TestBed.createComponent(CategoriasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
