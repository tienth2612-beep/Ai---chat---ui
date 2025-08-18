"use client";

import { useState, useCallback } from "react";
import { excelService } from "@/lib/service/excel.service";
import {
    ExcelTemplateColumn,
    ExcelTemplateDetailResponse,
    ExcelTemplateResponse,
} from "@/types/excel_config";
import { BaseResultWithData, PageResult } from "@/types/api";

export function useExcel() {
    const [templates, setTemplates] = useState<ExcelTemplateResponse[]>([]);
    const [totalTemplates, setTotalTemplates] = useState(0);
    const [templateDetail, setTemplateDetail] =
        useState<ExcelTemplateDetailResponse | null>(null);
    const [templateColumn, setTemplateColumn] =
        useState<ExcelTemplateColumn | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getExcelTemplates = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await excelService.getExcelTemplates();

            if (response && response.items) {
                setTemplates(response.items);
                setTotalTemplates(response.totalCount);
                return response.items;
            } else {
                setError("Failed to fetch excel templates");
                return null;
            }
        } catch (error) {
            console.error("Get excel templates error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const uploadTemplate = useCallback(async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await excelService.uploadTemplate(data);

            if (response && response.isSuccess) {
                return response.data;
            } else {
                setError(response.message || "Failed to upload template");
                return null;
            }
        } catch (error) {
            console.error("Upload template error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getExcelTemplate = useCallback(async (templateId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await excelService.getExcelTemplate(templateId);

            if (response && response.isSuccess) {
                setTemplateDetail(response.data);
                return response.data;
            } else {
                setError("Failed to fetch template detail");
                return null;
            }
        } catch (error) {
            console.error("Get template detail error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getExcelTemplateColumns = useCallback(
        async (templateId: number, columnId: number) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await excelService.getExcelTemplateColumns(
                    templateId,
                    columnId
                );

                if (response && response.isSuccess) {
                    setTemplateColumn(response.data);
                    return response.data;
                } else {
                    setError("Failed to fetch template column");
                    return null;
                }
            } catch (error) {
                console.error("Get template column error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const updateExcelTemplate = useCallback(
        async (templateId: number, data: Partial<ExcelTemplateResponse>) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await excelService.updateExcelTemplate(
                    templateId,
                    data
                );

                if (response && response.isSuccess) {
                    return response.data;
                } else {
                    setError("Failed to update template");
                    return null;
                }
            } catch (error) {
                console.error("Update template error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
                
            }
        },
        []
    );

    const deleteExcelTemplate = useCallback(
        async (templateId: number, data: Partial<ExcelTemplateResponse>) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await excelService.deleteExcelTemplate(
                    templateId,
                    data
                );

                if (response && response.isSuccess) {
                    return response.data;
                } else {
                    setError("Failed to delete template");
                    return null;
                }
            } catch (error) {
                console.error("Delete template error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const createExcelTemplateColumn = useCallback(
        async (templateId: number, data: Partial<ExcelTemplateColumn>) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await excelService.createExcelTemplateColumn(
                    templateId,
                    data
                );

                if (response && response.isSuccess) {
                    return response.data;
                } else {
                    setError("Failed to create template column");
                    return null;
                }
            } catch (error) {
                console.error("Create template column error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const updateExcelTemplateColumn = useCallback(
        async (
            templateId: number,
            columnId: number,
            data: Partial<ExcelTemplateColumn>
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await excelService.updateExcelTemplateColumn(
                    templateId,
                    columnId,
                    data
                );

                if (response && response.isSuccess) {
                    return response.data;
                } else {
                    setError("Failed to update template column");
                    return null;
                }
            } catch (error) {
                console.error("Update template column error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const deleteExcelTemplateColumn = useCallback(
        async (
            templateId: number,
            columnId: number,
            data: Partial<ExcelTemplateColumn>
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await excelService.deleteExcelTemplateColumn(
                    templateId,
                    columnId,
                    data
                );

                if (response && response.isSuccess) {
                    return response.data;
                } else {
                    setError("Failed to delete template column");
                    return null;
                }
            } catch (error) {
                console.error("Delete template column error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        templates,
        totalTemplates,
        templateDetail,
        templateColumn,
        isLoading,
        error,
        getExcelTemplates,
        uploadTemplate,
        getExcelTemplate,
        getExcelTemplateColumns,
        updateExcelTemplate,
        deleteExcelTemplate,
        createExcelTemplateColumn,
        updateExcelTemplateColumn,
        deleteExcelTemplateColumn,
    };
}
