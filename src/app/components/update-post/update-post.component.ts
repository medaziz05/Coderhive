import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostType } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css'],
})
export class UpdatePostComponent implements OnInit {
  postForm!: FormGroup;
  postId!: number;
  postTypes = Object.values(PostType); // Enum values
  postData!: Post; // Store previous post data

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialize form with empty values
    this.postForm = this.fb.group({
      content: ['', Validators.required],
      tag: ['', Validators.required],
      postType: ['', Validators.required],
      userId: [123], // Static userId
    });

    // Fetch post data by ID and prefill the form
    this.postService.getPostById(this.postId).subscribe(
      (post) => {
        console.log(post);
        this.postData = post; // Store original data
        this.postForm.patchValue(post); // Prefill form with data
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onUpdatePost(): void {
    if (this.postForm.valid) {
      this.postService.updatePost(this.postId, this.postForm.value).subscribe({
        next: () => {
          alert('Post updated successfully!');
          this.router.navigate(['/forums']); // Redirect to homepage
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to update post');
        },
      });
    }
  }
}
