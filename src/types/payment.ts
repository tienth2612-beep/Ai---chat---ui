import { FilterRequest } from "./api";

export interface PaymentHistoryResponse {
    id: number;
    description: string | null;
    status: number;
    type: number;
    value: number;
    createBy: number;
    createAt: string;
    updateBy: number;
    updateAt: string;
    code: string | null;
    companyId: number;
}

export interface PaymentHistoryRequest extends FilterRequest {}
