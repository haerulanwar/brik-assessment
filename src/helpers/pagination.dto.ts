export type PaginatedResource<T> = {
  total: number;
  data: T[];
  page: number;
  limit: number;
};
