import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceScannerComponent } from './presence-scanner.component';

describe('PresenceScannerComponent', () => {
  let component: PresenceScannerComponent;
  let fixture: ComponentFixture<PresenceScannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PresenceScannerComponent]
    });
    fixture = TestBed.createComponent(PresenceScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
