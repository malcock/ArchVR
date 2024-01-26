export interface SearchOptions<T> {
  term?: string;
  orderBy?: keyof T;
  sortDirection?: "asc" | "desc";
  take?: number;
  skip?: number;
}
