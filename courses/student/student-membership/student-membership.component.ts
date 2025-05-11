import { Component } from '@angular/core';
import {  } from '../../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-membership',
  templateUrl: './student-membership.component.html',
  styleUrls: ['./student-membership.component.scss'],
})
export class StudentMemebership {
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
  ) {}

}
