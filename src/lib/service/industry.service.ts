import api from "../axios";
import { BaseResult, BaseResultWithData, PageResult } from "@/types/api";
import * as IndustryModel from "@/types/industry";
import { API_URL } from "../constants";

export const industryService = {
    getListIndustry: async (
        data: Partial<IndustryModel.IndustryRequest>
    ): Promise<PageResult<IndustryModel.IndustryResponse>> => {
        try {
            return await api.get(API_URL.INDUSTRY, { params: data });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getIndustryById: async (
        id: string
    ): Promise<BaseResultWithData<IndustryModel.IndustryResponse>> => {
        try {
            return await api.get(`${API_URL.INDUSTRY}/${id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    createIndustry: async (
        data: Partial<IndustryModel.IndustryCreateRequest>
    ): Promise<BaseResultWithData<IndustryModel.IndustryResponse>> => {
        try {
            return await api.post(API_URL.INDUSTRY, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    updateIndustry: async (
        id: string,
        data: Partial<IndustryModel.IndustryCreateRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.put(`${API_URL.INDUSTRY}/${id}`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    toggleStatusIndustry: async (
        id: string,
        data: Partial<IndustryModel.IndustryCreateRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(
                `${API_URL.INDUSTRY}/${id}/toggle-status`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },
};
