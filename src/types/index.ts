export interface BookDetails {
  key: string;
  title: string;
  authors?: Array<{ author: { key: string } }>; // Work response format
  author_name?: string[]; // Search response format
  description?: string | BookDetailDescription;
  publish_date?: string;
  covers?: number[];
  subjects?: string[];
  publishers?: string[];
  works?: Array<{ key: string }>;
  first_publish_year?: number;
}

export interface BookDetailDescription {
  type?: string;
  value: string;
}

export interface AuthorDetails {
  name: string;
  key: string;
  personal_name?: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { value: string };
  photos?: number[];
}
