import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) {} // Inject Router

  navigateToAddCourse() {
    console.log('Navigating to Add Course...');
    this.router.navigate(['/add-course']); // Navigate to add-course page
  }
}
