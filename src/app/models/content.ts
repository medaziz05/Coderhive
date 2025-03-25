export interface Content {
  id?: number;
  contentType: ContentType;
  contentUrl: string;
  duration: number; // Duration in minutes
  moduleId: number;
}
export enum ContentType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  SLIDES = 'SLIDES',
  LINK = 'LINK',
}
