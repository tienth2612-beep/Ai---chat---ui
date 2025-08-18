"use client";

import { useState, useCallback } from "react";
import * as IndustryModel from "@/types/industry";
import { industryService } from "@/lib/service/industry.service";

export function useIndustry() {
    const [industries, setIndustries] = useState<
        IndustryModel.IndustryResponse[]
    >([]);
    const [industry, setIndustry] =
        useState<IndustryModel.IndustryResponse | null>(null);
    const [totalIndustries, setTotalIndustries] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get industries with filters
    const getIndustries = useCallback(
        async (filters: Partial<IndustryModel.IndustryRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await industryService.getListIndustry(filters);

                if (response.items && response) {
                    setIndustries(response.items);
                    setTotalIndustries(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch industries");
                    return { industries: [], total: 0 };
                }
            } catch (error) {
                console.error("Get industries error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { industries: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Get industry by ID
    const getIndustryById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await industryService.getIndustryById(id);

            if (response.isSuccess && response.data) {
                setIndustry(response.data);
                return response.data;
            } else {
                setError(response.message || "Failed to fetch industry");
                return null;
            }
        } catch (error) {
            console.error("Get industry error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create industry
    const createIndustry = useCallback(
        async (industryData: Partial<IndustryModel.IndustryCreateRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await industryService.createIndustry(
                    industryData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to create industry");
                    return null;
                }
            } catch (error) {
                console.error("Create industry error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Update industry
    const updateIndustry = useCallback(
        async (
            id: string,
            industryData: Partial<IndustryModel.IndustryCreateRequest>
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await industryService.updateIndustry(
                    id,
                    industryData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to update industry");
                    return null;
                }
            } catch (error) {
                console.error("Update industry error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Toggle industry status
    const toggleIndustryStatus = useCallback(
        async (
            id: string,
            industryData: Partial<IndustryModel.IndustryCreateRequest>
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await industryService.toggleStatusIndustry(
                    id,
                    industryData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(
                        response.message || "Failed to toggle industry status"
                    );
                    return null;
                }
            } catch (error) {
                console.error("Toggle industry status error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        industries,
        industry,
        totalIndustries,
        isLoading,
        error,
        getIndustries,
        getIndustryById,
        createIndustry,
        updateIndustry,
        toggleIndustryStatus,
    };
}
