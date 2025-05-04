import { FilterRequest } from "./api";

export interface GetAllPackageRequest extends FilterRequest {}
export interface GetSubscriptionHistoryRequest extends FilterRequest {}
export interface CreateUpdatePackageRequest {
    id: number;
    name: string;
    pricePerMonth: number;
    pricePerYear: number;
}
export interface DeletePackageRequest {
    id: number;
    active: boolean;
}

export interface PackageResponse {
    id: number;
    name: string;
    pricePerMonth: number;
    pricePerYear: number;
    createAt: Date;
    createBy: number;
    updateAt: Date;
    updateBy: number;
    active: boolean;
}

export interface SubscriptionHistoryResponse {
    id: number;
    companyId: number;
    packageId: number;
    status: number;
    createBy: number;
    createTime: Date;
    duration: number;
    startDate: Date;
    endDate: Date;
    active: boolean;
}
