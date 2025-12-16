// utils/pagination.ts
interface PaginationQuery {
  limit?: string | number;
  page?: string | number;
  skip?: string | number;
  orderBy?: string;
  order?: "ASC" | "DESC" | string;
}

export const parsePagination = (query: PaginationQuery) => {
  const limit = Math.max(Number(query.limit) || 10, 1);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = query.skip ? Number(query.skip) : (page - 1) * limit;
  const orderBy = query.orderBy || "createdAt";
  const order = (query.order || "DESC").toUpperCase() as "ASC" | "DESC";

  return { limit, page, skip, orderBy, order };
};

// ✅ Updated to accept (total, limit, page) instead of (total, skip, limit)
export const buildPaginationResponse = (
  total: number,
  limit: number,
  page: number
) => {
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  
  return { 
    total, 
    page, 
    skip, 
    limit, 
    totalPages 
  };
};