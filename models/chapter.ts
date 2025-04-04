export interface Chapter {
  chapterId: number;
  chapterTitle: string;
  chapterDescription: string;
  chapterOrder: number;
  chapterLocked: boolean; // Keep this to represent the current status of the chapter (locked or unlocked)
  chapterCreatedAt: Date;
  chapterUpdatedAt: Date;
  courseId: number;
  attachments?: ChapterAttachment[]; // Optional if attachments exist
}
export interface ChapterRequest {
  chapterTitle: string;
  chapterDescription: string;
  chapterOrder: number;
  // Removed chapterLocked, as this is handled by the backend logic
}

export interface ChapterAttachment {
  fileName: string;
  fileType: string;
  previewUrl: string;
  uploadedAt: Date | null;
  filePath: string; // Optional if needed for other purposes
}

// Chapter List DTO - to represent chapters in lists with Order and Title only
export interface ChapterListDTO {
  chapterId: number;
  chapterTitle: string;
  chapterOrder: number;
}
// Chapter Details DTO - to represent detailed chapter information
export interface ChapterDetails {
  chapterId: number;
  chapterTitle: string;
  chapterDescription: string;
  chapterOrder: number;
  chapterCreatedAt: string;
  chapterUpdatedAt: string;
  courseId: number;
  attachments: ChapterAttachment[];
}
export interface AttachmentDTO {
  fileName: string;
  fileType: string;
  previewUrl: string;
  uploadedAt: Date | null;
  filePath?: string; 
}
