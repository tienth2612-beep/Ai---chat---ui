import api, { apiFormBuilder } from "../axios";
import {
    ExcelTemplateColumn,
    ExcelTemplateDetailResponse,
    ExcelTemplateResponse,
} from "@/types/excel_config";
import { API_URL } from "../constants";
import { AxiosError } from "axios";
import { BaseResultWithData, PageResult } from "@/types/api";

export const excelService = {
    getExcelTemplates: async (): Promise<PageResult<ExcelTemplateResponse>> => {
        try {
            return api.get(API_URL.GET_TEMPLATES);
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
    uploadTemplate: async (
        data: FormData
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return apiFormBuilder.post(API_URL.UPLOAD_TEMPLATE, data);
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
    getExcelTemplate: async (
        templateId: number
    ): Promise<BaseResultWithData<ExcelTemplateDetailResponse>> => {
        try {
            return api.get(`${API_URL.GET_TEMPLATES}/${templateId}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
    getExcelTemplateColumns: async (
        templateId: number,
        columnId: number
    ): Promise<BaseResultWithData<ExcelTemplateColumn>> => {
        try {
            return api.get(
                `${API_URL.GET_TEMPLATES}/${templateId}/column/${columnId}`
            );
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
    updateExcelTemplate: async (
        templateId: number,
        data: Partial<ExcelTemplateResponse>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return api.put(`${API_URL.GET_TEMPLATES}/${templateId}`, data);
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
    deleteExcelTemplate: async (
        templateId: number,
        data: Partial<ExcelTemplateResponse>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return api.patch(`${API_URL.GET_TEMPLATES}/${templateId}`, data);
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
    createExcelTemplateColumn: async (
        templateId: number,
        data: Partial<ExcelTemplateColumn>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return api.post(`${API_URL.GET_TEMPLATES}/${templateId}`, data);
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
    updateExcelTemplateColumn: async (
        templateId: number,
        columnId: number,
        data: Partial<ExcelTemplateColumn>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return api.put(
                `${API_URL.GET_TEMPLATES}/${templateId}/column/${columnId}`,
                data
            );
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
    deleteExcelTemplateColumn: async (
        templateId: number,
        columnId: number,
        data: Partial<ExcelTemplateColumn>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return api.patch(
                `${API_URL.GET_TEMPLATES}/${templateId}/column/${columnId}`,
                data
            );
        } catch (error) {
            if (error instanceof AxiosError) {
                return error.response?.data || error;
            }
            throw error;
        }
    },
};
