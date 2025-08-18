import { FilterRequest } from "./api";

export interface IndustryResponse {
    id: number;
    name: string;
    status: number;
    createBy: number;
    createAt: string;
    updateBy: number;
    updateAt: string;
    totalCount: number;
}

export interface IndustryRequest extends FilterRequest {}

export interface IndustryCreateRequest {
    name: string;
    status: number;
}
