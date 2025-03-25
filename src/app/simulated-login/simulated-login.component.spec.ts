import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatedLoginComponent } from './simulated-login.component';

describe('SimulatedLoginComponent', () => {
  let component: SimulatedLoginComponent;
  let fixture: ComponentFixture<SimulatedLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimulatedLoginComponent]
    });
    fixture = TestBed.createComponent(SimulatedLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
