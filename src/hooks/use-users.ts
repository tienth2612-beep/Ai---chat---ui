"use client";

import { useState, useCallback } from "react";
import { userService } from "@/lib/service/user.service";
import * as UserModel from "@/types/user";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

// Hook
export function useUsers() {
    const [users, setUsers] = useState<UserModel.UserResponse[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get users with filters
    const getUsers = useCallback(
        async (filters: Partial<UserModel.GetAllUsersRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await userService.GetAllUser(filters);

                if (response.items && response) {
                    setUsers(response.items);
                    setTotalUsers(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch users");
                    return { users: [], total: 0 };
                }
            } catch (error) {
                console.error("Get users error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { users: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // // Get user by ID
    // const getUserById = useCallback(async (id: string) => {
    //     setIsLoading(true);
    //     setError(null);

    //     try {
    //         const response = await apiClient.get<User>(`/users/${id}`);

    //         if (response.success && response.data) {
    //             return response.data;
    //         } else {
    //             setError(response.error || "Failed to fetch user");
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error("Get user error:", error);
    //         setError("An unexpected error occurred. Please try again.");
    //         return null;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, []);

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
        users,
        totalUsers,
        isLoading,
        error,
        getUsers,
        formatDateRange,
    };
}
