import api from "../axios";
import { BaseResult, BaseResultWithData, PageResult } from "@/types/api";
import * as RbacModel from "@/types/rbac";
import { API_URL } from "../constants";
import { PaymentHistoryRequest, PaymentHistoryResponse } from "@/types/payment";
export const paymentService = {
    getPaymentHistory: async (
        data: Partial<PaymentHistoryRequest>
    ): Promise<PageResult<PaymentHistoryResponse>> => {
        try {
            return await api.get(API_URL.PAYMENT_HISTORY, { params: data });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getPaymentHistoryByCompanyId: async (
        id: number,
        data: Partial<PaymentHistoryRequest>
    ): Promise<PageResult<PaymentHistoryResponse>> => {
        try {
            return await api.get(`${API_URL.PAYMENT_HISTORY}/company/${id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
};
