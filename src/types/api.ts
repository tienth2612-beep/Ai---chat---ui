export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

export interface BaseResultWithData<T> {
    isSuccess: boolean;
    code: number;
    message: string;
    data: T;
}

export interface BaseResult {
    isSuccess: boolean;
    code: number;
    message: string;
    errors?: Record<string, string[]>;
}

export interface PageResult<T> {
    items?: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}
