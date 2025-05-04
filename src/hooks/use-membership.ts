"use client";

import { useState, useCallback } from "react";
import * as MembershipModel from "@/types/membership";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { membershipService } from "@/lib/service/membership.service";

// Hook
export function useMemberships() {
    const [memberships, setMemberships] = useState<
        MembershipModel.PackageResponse[]
    >([]);
    const [membership, setMembership] =
        useState<MembershipModel.PackageResponse | null>(null);
    const [totalMemberships, setTotalMemberships] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get memberships with filters
    const getMemberships = useCallback(
        async (filters: Partial<MembershipModel.GetAllPackageRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await membershipService.getListMembership(
                    filters
                );

                if (response.items && response) {
                    setMemberships(response.items);
                    setTotalMemberships(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch memberships");
                    return { memberships: [], total: 0 };
                }
            } catch (error) {
                console.error("Get memberships error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { memberships: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Get membership by ID
    const getMembershipById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await membershipService.getMembershipById(id);

            if (response.isSuccess && response.data) {
                setMembership(response.data);
            } else {
                setError(response.message || "Failed to fetch membership");
                return null;
            }
        } catch (error) {
            console.error("Get membership error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create membership
    const createMembership = useCallback(
        async (membershipData: MembershipModel.CreateUpdatePackageRequest) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await membershipService.createPackage(
                    membershipData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to create membership");
                    return null;
                }
            } catch (error) {
                console.error("Create membership error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Update membership
    const updateMembership = useCallback(
        async (
            id: string,
            membershipData: Partial<MembershipModel.CreateUpdatePackageRequest>
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await membershipService.updatePackage(
                    membershipData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to update membership");
                    return null;
                }
            } catch (error) {
                console.error("Update membership error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Delete membership
    const deleteMembership = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await membershipService.deletePackage({
                id: Number(id),
                active: false,
            });

            if (response.isSuccess) {
                return true;
            } else {
                setError(response.message || "Failed to delete membership");
                return false;
            }
        } catch (error) {
            console.error("Delete membership error:", error);
            setError("An unexpected error occurred. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Helper function to format date range for API
    const formatDateRange = (dateRange: DateRange | undefined) => {
        if (!dateRange) return { startDate: undefined, endDate: undefined };

        return {
            startDate: dateRange.from
                ? format(dateRange.from, "yyyy-MM-dd")
                : undefined,
            endDate: dateRange.to
                ? format(dateRange.to, "yyyy-MM-dd")
                : undefined,
        };
    };

    return {
        memberships,
        totalMemberships,
        membership,
        isLoading,
        error,
        getMemberships,
        getMembershipById,
        createMembership,
        updateMembership,
        deleteMembership,
        formatDateRange,
    };
}
