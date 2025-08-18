import api from "../axios";
import { BaseResultWithData, PageResult } from "@/types/api";
import * as CompanyModel from "@/types/company";
import * as JobModel from "@/types/job";
import * as QuoteModel from "@/types/quote";
import * as InvoiceModel from "@/types/invoice";
import * as UserModel from "@/types/user";
import { API_URL } from "../constants";
import { AxiosError } from "axios";

export const companyService = {
    GetAllCompany: async (
        data?: Partial<CompanyModel.GetAllCompanyRequest>
    ): Promise<PageResult<CompanyModel.CompanyResponse>> => {
        try {
            return api.get(API_URL.COMPANY, { params: data });
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },

    GetAllUser: async (
        id: number,
        data: Partial<UserModel.GetAllUsersRequest>
    ): Promise<PageResult<UserModel.UserResponse>> => {
        try {
            return api.get(`${API_URL.COMPANY}/${id}/member`, {
                params: data,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },

    GetCompanyById: async (
        id: number
    ): Promise<BaseResultWithData<CompanyModel.DetailCompanyResponse>> => {
        try {
            return api.get(`${API_URL.COMPANY}/${id}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },

    GetCompanyActiveWork: async (
        id: number
    ): Promise<PageResult<CompanyModel.CompanyActiveWorkResponse>> => {
        return api.get(`${API_URL.COMPANY}/${id}/active-works`);
    },

    GetCompanyMetrics: async (
        id: number
    ): Promise<BaseResultWithData<CompanyModel.CompanyMetricsResponse>> => {
        return api.get(`${API_URL.COMPANY}/${id}/metrics`);
    },

    GetCompanyJobs: async (
        id: number,
        data: Partial<JobModel.GetJobsRequest>
    ): Promise<PageResult<JobModel.JobResponse>> => {
        return api.get(`${API_URL.COMPANY}/${id}/jobs`, { params: data });
    },

    GetCompanyQuotes: async (
        id: number,
        data: Partial<QuoteModel.GetQuotesRequest>
    ): Promise<PageResult<QuoteModel.QuotesResponse>> => {
        return api.get(`${API_URL.COMPANY}/${id}/quotes`, { params: data });
    },

    GetCompanyInvoices: async (
        id: number,
        data: Partial<InvoiceModel.GetInvoicesRequest>
    ): Promise<PageResult<InvoiceModel.InvoicesResponse>> => {
        return api.get(`${API_URL.COMPANY}/${id}/invoices`, { params: data });
    },
    GetCompanyRequestsUpdate: async (
        id: number
    ): Promise<PageResult<CompanyModel.DetailCompanyResponse>> => {
        return api.get(`${API_URL.COMPANY}/${id}/request-update`);
    },
    GetCompanyRequestUpdateById: async (
        companyId: number,
        requestId: number
    ): Promise<BaseResultWithData<CompanyModel.DetailCompanyResponse>> => {
        return api.get(
            `${API_URL.COMPANY}/${companyId}/request-update/${requestId}`
        );
    },
    UpdateCompanyRequestUpdate: async (
        companyId: number,
        requestId: number,
        data: Partial<CompanyModel.Company>
    ): Promise<BaseResultWithData<CompanyModel.DetailCompanyResponse>> => {
        return api.post(
            `${API_URL.COMPANY}/${companyId}/request-update/${requestId}`,
            data
        );
    },
};
