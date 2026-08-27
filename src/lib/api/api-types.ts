export type ApiResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code?: string;
    details?: unknown;
  };
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedData<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
