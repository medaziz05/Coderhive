import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHackathonListComponent } from './admin-hackathon-list.component';

describe('AdminHackathonListComponent', () => {
  let component: AdminHackathonListComponent;
  let fixture: ComponentFixture<AdminHackathonListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminHackathonListComponent]
    });
    fixture = TestBed.createComponent(AdminHackathonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
