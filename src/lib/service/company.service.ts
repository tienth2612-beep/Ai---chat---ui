import api from "../axios";
import { BaseResultWithData } from "@/types/api";
import * as CompanyModel from "@/types/company";
import * as UserModel from "@/types/user";
import { API_URL } from "../constants";
import { AxiosError } from "axios";

export const companyService = {
    GetAllCompany: async (
        data?: Partial<CompanyModel.GetAllCompanyRequest>
    ): Promise<BaseResultWithData<CompanyModel.CompanyResponse>> => {
        try {
            return api.post(API_URL.COMPANY, { params: data });
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
    ): Promise<BaseResultWithData<UserModel.UserResponse>> => {
        try {
            return api.post(`${API_URL.COMPANY}/${id}`, {
                params: data,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
};
