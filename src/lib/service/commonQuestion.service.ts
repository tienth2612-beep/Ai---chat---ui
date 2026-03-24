import api from "../axios";
import { BaseResult, BaseResultWithData, PageResult } from "@/types/api";
import * as UserAuth from "@/types/auth";
import { UserResponse } from "@/types/user";
import { API_URL } from "../constants";
import * as WelcomeQuestionModel from "@/types/commonQuestion";

export const commonQuestionService = {
    getGroups: async (): Promise<
        PageResult<WelcomeQuestionModel.CommonGroupQuestionResponse[]>
    > => {
        try {
            return await api.get(API_URL.COMMON_QUESTION);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    createGroup: async (
        data: Partial<WelcomeQuestionModel.InitGroupRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(API_URL.COMMON_QUESTION, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    updateGroup: async (
        id: number,
        data: Partial<WelcomeQuestionModel.InitGroupRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.put(`${API_URL.COMMON_QUESTION}/${id}`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    toggleGroupStatus: async (
        id: number,
        data: Partial<WelcomeQuestionModel.InitGroupRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(`${API_URL.COMMON_QUESTION}/${id}`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getQuestionsInGroup: async (
        groupId: number,
        data: Partial<WelcomeQuestionModel.GetQuestionRequest>
    ): Promise<PageResult<WelcomeQuestionModel.QuestionResponse>> => {
        try {
            return await api.get(`${API_URL.COMMON_QUESTION}/${groupId}`, {
                params: data,
            });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getQuestionDetail: async (
        id: number
    ): Promise<
        BaseResultWithData<WelcomeQuestionModel.QuestionDetailResponse>
    > => {
        try {
            return await api.get(`${API_URL.COMMON_QUESTION}/question/${id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    createQuestion: async (
        groupId: number,
        data: Partial<WelcomeQuestionModel.InitQuestionRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(
                `${API_URL.COMMON_QUESTION}/${groupId}`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    updateQuestion: async (
        id: number,
        data: Partial<WelcomeQuestionModel.InitQuestionRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.put(
                `${API_URL.COMMON_QUESTION}/question/${id}`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    toggleQuestionStatus: async (
        id: number,
        data: WelcomeQuestionModel.InitQuestionRequest
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(
                `${API_URL.COMMON_QUESTION}/question/${id}`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    getAnswer: async (
        questionId: number,
        answerId: number
    ): Promise<BaseResultWithData<WelcomeQuestionModel.AnswerResponse>> => {
        try {
            return await api.get(
                `${API_URL.COMMON_QUESTION}/question/${questionId}/answers/${answerId}`
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    initAnswer: async (
        questionId: number,
        data: WelcomeQuestionModel.InitAnswerRequest
    ): Promise<BaseResultWithData<WelcomeQuestionModel.AnswerResponse>> => {
        try {
            return await api.post(
                `${API_URL.COMMON_QUESTION}/question/${questionId}/answers`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    updateAnswer: async (
        questionId: number,
        answerId: number,
        data: WelcomeQuestionModel.InitAnswerRequest
    ): Promise<BaseResultWithData<WelcomeQuestionModel.AnswerResponse>> => {
        try {
            return await api.put(
                `${API_URL.COMMON_QUESTION}/question/${questionId}/answers/${answerId}`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    toggleAnswerStatus: async (
        questionId: number,
        answerId: number,
        data: WelcomeQuestionModel.InitAnswerRequest
    ): Promise<BaseResultWithData<WelcomeQuestionModel.AnswerResponse>> => {
        try {
            return await api.patch(
                `${API_URL.COMMON_QUESTION}/question/${questionId}/answers/${answerId}`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
};
