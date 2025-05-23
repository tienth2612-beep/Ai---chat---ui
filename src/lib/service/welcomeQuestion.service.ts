import api from "../axios";
import { BaseResult, BaseResultWithData, PageResult } from "@/types/api";
import * as UserAuth from "@/types/auth";
import { UserResponse } from "@/types/user";
import { API_URL } from "../constants";
import * as WelcomeQuestionModel from "@/types/welcomeQuestion";

export const welcomeQuestionService = {
    getQuestions: async (
        data: Partial<WelcomeQuestionModel.GetQuestionRequest>
    ): Promise<PageResult<WelcomeQuestionModel.QuestionResponse>> => {
        try {
            return await api.get(API_URL.WELCOME_QUESTION, { params: data });
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
            return await api.get(`${API_URL.WELCOME_QUESTION}/${id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    createQuestion: async (
        data: Partial<WelcomeQuestionModel.InitQuestionRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(API_URL.WELCOME_QUESTION, data);
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
            return await api.put(`${API_URL.WELCOME_QUESTION}/${id}`, data);
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
            return await api.patch(`${API_URL.WELCOME_QUESTION}/${id}`, data);
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
                `${API_URL.WELCOME_QUESTION}/${questionId}/answers/${answerId}`
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
                `${API_URL.WELCOME_QUESTION}/${questionId}/answers`,
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
                `${API_URL.WELCOME_QUESTION}/${questionId}/answers/${answerId}`,
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
                `${API_URL.WELCOME_QUESTION}/${questionId}/answers/${answerId}`,
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
