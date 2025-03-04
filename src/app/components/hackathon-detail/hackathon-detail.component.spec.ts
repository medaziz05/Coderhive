import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackathonDetailComponent } from './hackathon-detail.component';

describe('HackathonDetailComponent', () => {
  let component: HackathonDetailComponent;
  let fixture: ComponentFixture<HackathonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HackathonDetailComponent]
    });
    fixture = TestBed.createComponent(HackathonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
