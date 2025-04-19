 
export interface PaginationOptions {
    page?: number;
    limit?: number;
  }
  
  export function getPagination({ page = 1, limit = 8 }: PaginationOptions) {
    const skip = (page - 1) * limit;
    return { skip, limit, page };
  }
  
  export function buildPaginationResponse<T>(items: T[], total: number, page: number, limit: number) {
    return {
      data: items,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }
  