import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPedidoComponent } from './confirmacion-pedido.component';

describe('ConfirmacionPedidoComponent', () => {
  let component: ConfirmacionPedidoComponent;
  let fixture: ComponentFixture<ConfirmacionPedidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionPedidoComponent]
    });
    fixture = TestBed.createComponent(ConfirmacionPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
