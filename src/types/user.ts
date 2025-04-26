//#region "Request"
export interface GetAllUsersRequest {
    fromDate: string;
    toDate: string;
    page: number;
    pageSize: number;
    search: string | null;
}
export interface GetUserRequest {
    userId: number;
}
//#endregion

//#region "Response"
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserResponse {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    userName: string | null;
    createAt: string;
    updateAt: string;
    status: number;
    company: UserCompanyResponse | null;
    totalCount: number;
}

export interface UserCompanyResponse {
    id: number;
    name: string | null;
    icon: string | null;
    email: string | null;
}
//#endregion
