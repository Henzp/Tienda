import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasBannerComponent } from './marcas-banner.component';

describe('MarcasBannerComponent', () => {
  let component: MarcasBannerComponent;
  let fixture: ComponentFixture<MarcasBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarcasBannerComponent]
    });
    fixture = TestBed.createComponent(MarcasBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
