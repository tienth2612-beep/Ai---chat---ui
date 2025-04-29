import api from "../axios";
import { BaseResult, BaseResultWithData, PageResult } from "@/types/api";
import * as CompanyModel from "@/types/company";
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
};
