import { Likes } from './likes';

export enum PostType {
  SOLVING_PROBLEM = 'SOLVING_PROBLEM',
  FREELANCER = 'FREELANCER',
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  postType: PostType;
  tag: string;
  created_at: Date;
  updated_at: Date;
  comments: Comment[];
  likes: Likes[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
