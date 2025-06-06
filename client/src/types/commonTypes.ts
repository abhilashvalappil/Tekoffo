export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

export type MetaType = {
  total: number;
  page: number;
  pages: number;
  limit: number;
};