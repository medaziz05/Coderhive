import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/models/comment';
import { Post, PostType } from 'src/app/models/post';
import { CommentService } from 'src/app/services/comment.service';
import { LikesService } from 'src/app/services/likes.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  postId: number = 0;
  post: Post | null = null;
  comments: Comment[] = [];
  comment = { content: '' };
  userId = 1;
  likeCount: number = 0;
  hasLiked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private postService: PostService,
    private likeService: LikesService
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPostDetail(this.postId);
    this.loadComments(this.postId);

    this.likeService.getLikeCount(this.postId).subscribe((count) => {
      this.likeCount = count;
    });

    // Check if user has liked the post
    this.likeService
      .hasUserLikedPost(this.postId, this.userId)
      .subscribe((hasLiked) => {
        this.hasLiked = hasLiked;
      });
  }

  loadPostDetail(id: number): void {
    this.postService.getPostById(id).subscribe(
      (response: Post) => {
        this.post = response; // Store the fetched post details
      },
      (error) => {
        console.error('Error fetching post:', error);
      }
    );
  }

  loadComments(postId: number): void {
    // Use the service to fetch comments for the post
    this.commentService.getCommentsByPost(postId).subscribe(
      (response: Comment[]) => {
        this.comments = response; // Assign fetched comments to the comments array
        console.log(response);
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  onSubmit(): void {
    let comm = { content: this.comment?.content };
    console.log(this.comment.content);
    this.commentService
      .createComment(this.postId, this.userId, JSON.stringify(comm))
      .subscribe({
        next: () => {
          this.comment.content = '';
          location.reload(); // Reload the page to update the post list
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to delete post');
        },
      });
  }

  onDeleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe(
      (response) => {
        // Remove the deleted comment from the list
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
        alert('Comment deleted successfully!');
      },
      (error) => {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
      }
    );
  }

  toggleLike(postId: any): void {
    // Optimistically update the UI
    this.hasLiked = !this.hasLiked;
    this.likeCount += this.hasLiked ? 1 : -1;

    // Call the service to toggle like state in backend
    this.likeService.toggleLike(this.postId, this.userId).subscribe(
      () => {
        // Successful backend response: like count is already updated optimistically
        console.log('Like count updated successfully!');
      },
      (error) => {
        // Handle error: revert UI change if something goes wrong
        this.hasLiked = !this.hasLiked;
        this.likeCount += this.hasLiked ? 1 : -1;
        console.error('Error updating like count:', error);
      }
    );
  }
}
