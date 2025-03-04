import { Post } from './post';

export interface Likes {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  post?: Post;
}
