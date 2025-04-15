import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarTicketsComponent } from './similar-tickets.component';

describe('SimilarTicketsComponent', () => {
  let component: SimilarTicketsComponent;
  let fixture: ComponentFixture<SimilarTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimilarTicketsComponent]
    });
    fixture = TestBed.createComponent(SimilarTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
