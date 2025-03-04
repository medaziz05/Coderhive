import { Component, OnInit } from '@angular/core';
import { PageResponse, Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  posts!: PageResponse<Post>;
  currentPage = 0;
  pageSize = 10;

  currentUserId!: number; // Should be set from your auth service

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPage(this.currentPage);
  }

  loadPage(page: number) {
    this.postService.getAllPosts(page, this.pageSize).subscribe({
      next: (response) => {
        this.posts = response;
        this.currentPage = page;
        console.log(this.posts, this.currentPage);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      },
    });
  }

  getPostLikesCount(post: Post): number {
    return this.postService.getPostLikesCount(post);
  }

  getPostCommentsCount(post: Post): number {
    return this.postService.getPostCommentsCount(post);
  }

  hasUserLikedPost(post: Post): boolean {
    return this.postService.hasUserLikedPost(post, this.currentUserId);
  }

  onDeletePost(postId: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          alert('Post deleted successfully!');
          location.reload(); // Reload the page to update the post list
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to delete post');
        },
      });
    }
  }
}
