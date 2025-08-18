"use client";

import { useState, useCallback } from "react";
import * as PaymentModel from "@/types/payment";
import { paymentService } from "@/lib/service/payment.service";

export function usePayment() {
    const [payments, setPayments] = useState<
        PaymentModel.PaymentHistoryResponse[]
    >([]);
    const [payment, setPayment] =
        useState<PaymentModel.PaymentHistoryResponse | null>(null);
    const [totalPayments, setTotalPayments] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get payment history with filters
    const getPaymentHistory = useCallback(
        async (filters: Partial<PaymentModel.PaymentHistoryRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await paymentService.getPaymentHistory(
                    filters
                );

                if (response.items && response) {
                    setPayments(response.items);
                    setTotalPayments(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch payment history");
                    return { payments: [], total: 0 };
                }
            } catch (error) {
                console.error("Get payment history error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { payments: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Get payment by ID
    const getPaymentHistoryByCompanyId = useCallback(
        async (
            id: number,
            filters: Partial<PaymentModel.PaymentHistoryRequest> = {}
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const response =
                    await paymentService.getPaymentHistoryByCompanyId(
                        id,
                        filters
                    );

                if (response.items) {
                    setPayments(response.items);
                    return response.items;
                } else {
                    setError("Failed to fetch payment");
                    return { payments: [], total: 0 };
                }
            } catch (error) {
                console.error("Get payment error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { payments: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        payments,
        payment,
        totalPayments,
        isLoading,
        error,
        getPaymentHistory,
        getPaymentHistoryByCompanyId,
    };
}
