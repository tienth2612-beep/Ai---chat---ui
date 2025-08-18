"use client";

import { useState, useCallback } from "react";
import * as UserModel from "@/types/user";
import { authUserService } from "@/lib/service/authUser.service";

export function useAuthUser() {
    const [users, setUsers] = useState<UserModel.UserResponse[]>([]);
    const [user, setUser] = useState<UserModel.UserResponse | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get all users with filters
    const getAllUsers = useCallback(
        async (filters: Partial<UserModel.GetAllUsersRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await authUserService.GetAllUser(filters);

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

    // Get user by ID
    const getAuthUser = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authUserService.getAuthUser(id);

            if (response.isSuccess && response.data) {
                setUser(response.data);
                return response.data;
            } else {
                setError(response.message || "Failed to fetch user");
                return null;
            }
        } catch (error) {
            console.error("Get user error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create user
    const createAuthUser = useCallback(
        async (userData: Partial<UserModel.UserCreateRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authUserService.createAuthUser(userData);

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to create user");
                    return null;
                }
            } catch (error) {
                console.error("Create user error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Update user
    const updateAuthUser = useCallback(
        async (id: number, userData: Partial<UserModel.UserUpdateRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authUserService.updateAuthUser(
                    id,
                    userData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to update user");
                    return null;
                }
            } catch (error) {
                console.error("Update user error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Toggle user status
    const toggleAuthUserStatus = useCallback(
        async (
            id: number,
            userData: Partial<UserModel.ToggleStatusRequest>
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authUserService.toggleAuthUserStatus(
                    id,
                    userData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(
                        response.message || "Failed to toggle user status"
                    );
                    return null;
                }
            } catch (error) {
                console.error("Toggle user status error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Invite user
    const inviteAuthUser = useCallback(
        async (userData: Partial<UserModel.UserInviteRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authUserService.inviteAuthUser(userData);

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to invite user");
                    return null;
                }
            } catch (error) {
                console.error("Invite user error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        users,
        user,
        totalUsers,
        isLoading,
        error,
        getAllUsers,
        getAuthUser,
        createAuthUser,
        updateAuthUser,
        toggleAuthUserStatus,
        inviteAuthUser,
    };
}
