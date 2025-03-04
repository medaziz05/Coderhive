import { Component, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment';
import { PageResponse, Post } from 'src/app/models/post';
import { CommentService } from 'src/app/services/comment.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-admin-post-list',
  templateUrl: './admin-post-list.component.html',
  styleUrls: ['./admin-post-list.component.css'],
})
export class AdminPostListComponent implements OnInit {
  posts!: PageResponse<Post>;
  currentPage = 0;
  pageSize = 10;
  selectedPostId: number | null = null;
  comments: Comment[] = [];

  currentUserId!: number; // Should be set from your auth service

  constructor(
    private postService: PostService,
    private commentService: CommentService
  ) {}

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

  getComments(postId: number) {
    this.selectedPostId = postId;
    this.commentService.getCommentsByPost(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
      },
    });
  }

  deleteComment(commentId: number) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(
            (comment) => comment.id !== commentId
          );
          alert('Comment deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          alert('Failed to delete comment');
        },
      });
    }
  }
}
