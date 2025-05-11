
  export interface SearchDTO {
    title?: string;
    numberOfQuestions?: number; // Changed from string|number
    difficulty?: string;
    categoryName?: string;
    size?: number;
    page?: number;
    sortByCreatedDate?: 'ASC' | 'DESC'; // Uppercase
    sortByDifficulty?: 'ASC' | 'DESC';  // Uppercase
  }