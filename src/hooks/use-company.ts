"use client";

import { useState, useCallback } from "react";
import * as CompanyModel from "@/types/company";
import * as UserModel from "@/types/user";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { companyService } from "@/lib/service/company.service";
import * as JobModel from "@/types/job";
import * as QuoteModel from "@/types/quote";
import * as InvoiceModel from "@/types/invoice";
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
    const [companyActiveWork, setCompanyActiveWork] = useState<
        CompanyModel.CompanyActiveWorkResponse[]
    >([]);
    const [totalCompanyActiveWork, setTotalCompanyActiveWork] = useState(0);
    const [companyMetrics, setCompanyMetrics] =
        useState<CompanyModel.CompanyMetricsResponse>();
    const [companyJobs, setCompanyJobs] = useState<JobModel.JobResponse[]>([]);
    const [totalCompanyJobs, setTotalCompanyJobs] = useState(0);
    const [companyQuotes, setCompanyQuotes] = useState<
        QuoteModel.QuotesResponse[]
    >([]);
    const [totalCompanyQuotes, setTotalCompanyQuotes] = useState(0);
    const [companyInvoices, setCompanyInvoices] = useState<
        InvoiceModel.InvoicesResponse[]
    >([]);
    const [totalCompanyInvoices, setTotalCompanyInvoices] = useState(0);
    const [companyRequestsUpdate, setCompanyRequestsUpdate] = useState<
        CompanyModel.DetailCompanyResponse[]
    >([]);
    const [totalCompanyRequestsUpdate, setTotalCompanyRequestsUpdate] =
        useState(0);
    const [companyRequestUpdate, setCompanyRequestUpdate] =
        useState<CompanyModel.DetailCompanyResponse | null>(null);

    // Get users with filters
    const getCompanies = useCallback(
        async (filters: Partial<CompanyModel.GetAllCompanyRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            try {
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
                    return [];
                }
            } catch (error) {
                console.error("Get users from company error:", error);
                setError("An unexpected error occurred. Please try again.");
                return [];
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

    const getCompanyActiveWork = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await companyService.GetCompanyActiveWork(
                Number.parseInt(id)
            );

            if (response && response.items) {
                setCompanyActiveWork(response.items);
                setTotalCompanyActiveWork(response.totalCount);
                return response.items;
            } else {
                setError("Failed to fetch company active work");
                return null;
            }
        } catch (error) {
            console.error("Get company active work error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getCompanyMetrics = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await companyService.GetCompanyMetrics(
                Number.parseInt(id)
            );

            if (response && response.isSuccess) {
                setCompanyMetrics(response.data);
                return response.data;
            } else {
                setError("Failed to fetch company metrics");
                return null;
            }
        } catch (error) {
            console.error("Get company metrics error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getCompanyJobs = useCallback(
        async (id: string, filters: Partial<JobModel.GetJobsRequest>) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await companyService.GetCompanyJobs(
                    Number.parseInt(id),
                    filters
                );

                if (response && response.items) {
                    setCompanyJobs(response.items);
                    setTotalCompanyJobs(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch company jobs");
                    return null;
                }
            } catch (error) {
                console.error("Get company jobs error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const getCompanyQuotes = useCallback(
        async (id: string, filters: Partial<QuoteModel.GetQuotesRequest>) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await companyService.GetCompanyQuotes(
                    Number.parseInt(id),
                    filters
                );

                if (response && response.items) {
                    setCompanyQuotes(response.items);
                    setTotalCompanyQuotes(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch company quotes");
                    return null;
                }
            } catch (error) {
                console.error("Get company quotes error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const getCompanyInvoices = useCallback(
        async (
            id: string,
            filters: Partial<InvoiceModel.GetInvoicesRequest>
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await companyService.GetCompanyInvoices(
                    Number.parseInt(id),
                    filters
                );

                if (response && response.items) {
                    setCompanyInvoices(response.items);
                    setTotalCompanyInvoices(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch company invoices");
                    return null;
                }
            } catch (error) {
                console.error("Get company invoices error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const getCompanyRequestsUpdate = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await companyService.GetCompanyRequestsUpdate(
                Number.parseInt(id)
            );

            if (response && response.items) {
                setCompanyRequestsUpdate(response.items);
                setTotalCompanyRequestsUpdate(response.totalCount);
                return response.items;
            } else {
                setError("Failed to fetch company requests update");
                return null;
            }
        } catch (error) {
            console.error("Get company requests update error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getCompanyRequestUpdateById = useCallback(
        async (companyId: string, requestId: string) => {
            setIsLoading(true);
            setError(null);
            try {
                const response =
                    await companyService.GetCompanyRequestUpdateById(
                        Number.parseInt(companyId),
                        Number.parseInt(requestId)
                    );

                if (response && response.isSuccess) {
                    setCompanyRequestUpdate(response.data);
                    return response.data;
                } else {
                    setError("Failed to fetch company request update");
                    return null;
                }
            } catch (error) {
                console.error("Get company request update error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const updateCompanyRequestUpdate = useCallback(
        async (
            companyId: string,
            requestId: string,
            data: Partial<CompanyModel.Company>
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const response =
                    await companyService.UpdateCompanyRequestUpdate(
                        Number.parseInt(companyId),
                        Number.parseInt(requestId),
                        data
                    );

                if (response && response.isSuccess) {
                    return response.data;
                } else {
                    setError("Failed to update company request");
                    return null;
                }
            } catch (error) {
                console.error("Update company request error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

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
        companyActiveWork,
        companyMetrics,
        companyJobs,
        totalCompanyJobs,
        companyQuotes,
        totalCompanyQuotes,
        companyInvoices,
        totalCompanyInvoices,
        totalCompanyActiveWork,
        companyRequestsUpdate,
        totalCompanyRequestsUpdate,
        companyRequestUpdate,
        getCompanies,
        getUserByCompanyId,
        formatDateRange,
        getCompanyById,
        getCompanyActiveWork,
        getCompanyMetrics,
        getCompanyJobs,
        getCompanyQuotes,
        getCompanyInvoices,
        getCompanyRequestsUpdate,
        getCompanyRequestUpdateById,
        updateCompanyRequestUpdate,
    };
}
