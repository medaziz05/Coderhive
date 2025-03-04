import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincreateHackathonComponent } from './admincreate-hackathon.component';

describe('AdmincreateHackathonComponent', () => {
  let component: AdmincreateHackathonComponent;
  let fixture: ComponentFixture<AdmincreateHackathonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmincreateHackathonComponent]
    });
    fixture = TestBed.createComponent(AdmincreateHackathonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
