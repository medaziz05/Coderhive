import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostType } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  postForm!: FormGroup;
  postTypes = Object.values(PostType); // ['SOLVING_PROBLEM', 'FREELANCER']
  userId = 1;
  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      content: ['', Validators.required],
      tag: ['', Validators.required],
      postType: ['', Validators.required],
      userId: [this.userId], // Hidden field in the form
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;

      this.postService.createPost(postData).subscribe({
        next: (response) => {
          alert('Post created successfully!');
          this.router.navigate(['/forums']);
          console.log(response);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to create post');
        },
      });
    }
  }
}
