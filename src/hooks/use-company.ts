"use client";

import { useState, useCallback } from "react";
import * as CompanyModel from "@/types/company";
import * as UserModel from "@/types/user";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { companyService } from "@/lib/service/company.service";

// Hook
export function useCompany() {
    const [companies, setCompanies] = useState<CompanyModel.CompanyResponse[]>(
        []
    );
    const [users, setUsers] = useState<UserModel.UserResponse[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCompanies, setTotalCompanies] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get users with filters
    const getCompanies = useCallback(
        async (filters: Partial<CompanyModel.GetAllCompanyRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            console.log("Request get user", filters);
            try {
                console.log("Request get user", filters);
                const response = await companyService.GetAllCompany(filters);

                if (response.items && response) {
                    setCompanies(response.items);
                    setTotalCompanies(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch companies");
                    return { companies: [], total: 0 };
                }
            } catch (error) {
                console.error("Get companies error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { companies: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Get user by ID
    const getUserByCompanyId = useCallback(
        async (id: string, filters: Partial<UserModel.GetAllUsersRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await companyService.GetAllUser(
                    Number.parseInt(id),
                    filters
                );

                if (response.items && response) {
                    setUsers(response.items);
                    setTotalUsers(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch users from company");
                    return { companies: [], total: 0 };
                }
            } catch (error) {
                console.error("Get users from company error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const getCompanyById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await companyService.GetCompanyById(
                Number.parseInt(id)
            );

            if (response && response.isSuccess) {
                return response.data;
            } else {
                setError("Failed to fetch detail company");
                return null;
            }
        } catch (error) {
            console.error("Get detail company error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);
    // // Create user
    // const createUser = useCallback(
    //     async (userData: Omit<User, "id" | "createdAt">) => {
    //         setIsLoading(true);
    //         setError(null);

    //         try {
    //             const response = await apiClient.post<User>("/users", userData);

    //             if (response.success && response.data) {
    //                 return response.data;
    //             } else {
    //                 setError(response.error || "Failed to create user");
    //                 return null;
    //             }
    //         } catch (error) {
    //             console.error("Create user error:", error);
    //             setError("An unexpected error occurred. Please try again.");
    //             return null;
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     },
    //     []
    // );

    // // Update user
    // const updateUser = useCallback(
    //     async (id: string, userData: Partial<User>) => {
    //         setIsLoading(true);
    //         setError(null);

    //         try {
    //             const response = await apiClient.put<User>(
    //                 `/users/${id}`,
    //                 userData
    //             );

    //             if (response.success && response.data) {
    //                 return response.data;
    //             } else {
    //                 setError(response.error || "Failed to update user");
    //                 return null;
    //             }
    //         } catch (error) {
    //             console.error("Update user error:", error);
    //             setError("An unexpected error occurred. Please try again.");
    //             return null;
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     },
    //     []
    // );

    // // Delete user
    // const deleteUser = useCallback(async (id: string) => {
    //     setIsLoading(true);
    //     setError(null);

    //     try {
    //         const response = await apiClient.delete<{ success: boolean }>(
    //             `/users/${id}`
    //         );

    //         if (response.success) {
    //             return true;
    //         } else {
    //             setError(response.error || "Failed to delete user");
    //             return false;
    //         }
    //     } catch (error) {
    //         console.error("Delete user error:", error);
    //         setError("An unexpected error occurred. Please try again.");
    //         return false;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, []);

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
        companies,
        totalCompanies,
        users,
        totalUsers,
        isLoading,
        error,
        getCompanies,
        getUserByCompanyId,
        formatDateRange,
        getCompanyById,
    };
}
