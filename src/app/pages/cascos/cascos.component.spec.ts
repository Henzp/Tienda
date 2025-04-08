import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascosComponent } from './cascos.component';

describe('CascosComponent', () => {
  let component: CascosComponent;
  let fixture: ComponentFixture<CascosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CascosComponent]
    });
    fixture = TestBed.createComponent(CascosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
