import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticssComponent } from './statisticss.component';

describe('StatisticssComponent', () => {
  let component: StatisticssComponent;
  let fixture: ComponentFixture<StatisticssComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticssComponent]
    });
    fixture = TestBed.createComponent(StatisticssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
