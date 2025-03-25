import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialisation du formulaire réactif avec le FormControl pour trainerId et date
    this.myForm = this.fb.group({
      trainerId: [null],
      date: [null]  // FormControl pour la date
    });
  }

  onSubmit(): void {
    console.log(this.myForm.value);
  }
}
