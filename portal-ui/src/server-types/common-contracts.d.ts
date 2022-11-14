export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PageableResources<T> {
  content: T[];
  page: Page;
}
