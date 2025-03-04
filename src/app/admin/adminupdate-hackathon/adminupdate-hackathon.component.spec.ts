import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminupdateHackathonComponent } from './adminupdate-hackathon.component';

describe('AdminupdateHackathonComponent', () => {
  let component: AdminupdateHackathonComponent;
  let fixture: ComponentFixture<AdminupdateHackathonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminupdateHackathonComponent]
    });
    fixture = TestBed.createComponent(AdminupdateHackathonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
