import { FilterRequest } from "./api";

//#region "Request"
export interface GetAllUsersRequest extends FilterRequest {}

export interface GetUserRequest {
    userId: number;
}

export interface UserCreateRequest {
    name: string;
    email: string;
    password: string;
}

export interface UserUpdateRequest {
    name: string;
    email: string;
    phone: string;
}

export interface UserInviteRequest {
    email: string;
}

export interface ToggleStatusRequest {
    status: number;
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
    address: string | null;
    userName: string | null;
    createAt: string;
    updateAt: string;
    status: number;
    company: UserCompanyResponse | null;
    role: number;
    avatar: string | null;
    totalCount: number;
}

export interface UserCompanyResponse {
    id: number;
    name: string | null;
    icon: string | null;
    email: string | null;
}
//#endregion
