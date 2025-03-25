import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  questionForm: FormGroup;
  questions: string[] = []; // Stocker les questions ajoutées

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const newQuestion = this.questionForm.value.questionText;
      this.questions.push(newQuestion); // Ajouter la question à la liste
      console.log('Nouvelle question ajoutée :', newQuestion);
      this.questionForm.reset();
    }
  }
}
