import { useState } from "react";

type PaginationState = {
  total: number;
  page: number;
  pages: number;
  limit: number;
};

export const usePagination = (initial: PaginationState) => {
  const [pagination, setPagination] = useState<PaginationState>(initial);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const updateMeta = (total: number, pages: number) => {
    setPagination((prev) => ({
      ...prev,
      total,
      pages,
    }));
  };

  return { pagination, setPagination, handlePageChange, updateMeta };
};
