export interface BackpackList {
  backpackId: number;
  title: string;
  imageUrl: string;
  createdAt: Date;
}

export interface BackpackDetails {
  backpackId: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  teacherId: number;
}

export interface BackpackRequest {
  title: string;
  content: string;
  image?: File;
}