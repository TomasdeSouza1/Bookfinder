export type LanguageFilter =
  | "all"
  | "spa"
  | "eng"
  | "fre"
  | "por"
  | "ita"
  | "ger";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  firstPublishYear: number | null;
  editionCount: number;
  publishers: string[];
  languages: string[];
  coverUrl: string | null;
  readOnlineUrl: string | null;
  hasFullText: boolean;
}

export interface SearchFilters {
  title: string;
  author: string;
  publisher: string;
  language: LanguageFilter;
  yearFrom?: number;
  yearTo?: number;
  onlyFreeReading: boolean;
  sortBy: "oldest" | "newest" | "relevance";
}

export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  edition_count?: number;
  publisher?: string[];
  language?: string[];
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  ebook_access?: "public" | "borrowable" | "printdisabled" | "no_ebook";
  ia?: string[];
  cover_i?: number;
  editions?: {
    docs?: {
      publisher?: string[];
    }[];
  };
}

export interface OpenLibraryResponse {
  numFound: number;
  docs: OpenLibraryDoc[];
}
