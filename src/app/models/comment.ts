import { Post } from './post';

export interface Comment {
  id: number;
  content?: string;
  created_at: Date;
  updated_at: Date;
  postId: number;
  post?: Post;
}
