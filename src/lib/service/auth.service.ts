import api from "../axios";
import { BaseResult, BaseResultWithData } from "@/types/api";
import * as UserAuth from "@/types/auth";
import { UserResponse } from "@/types/user";
import { API_URL } from "../constants";

export const authService = {
    login: async (
        data: UserAuth.LoginRequest
    ): Promise<BaseResultWithData<UserAuth.UserAuthResponse>> => {
        try {
            //const response = await api.post(API_URL.AUTH_LOGIN, data);

            return await api.post(API_URL.AUTH_LOGIN, data);
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },

    logout: async (): Promise<BaseResult> => {
        try {
            return await api.post(API_URL.AUTH_LOGOUT);
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },

    register: async (
        data: Partial<UserAuth.RegisterRequest>
    ): Promise<BaseResultWithData<UserAuth.UserAuthResponse>> => {
        try {
            return await api.post(API_URL.AUTH_SIGN_UP, data);
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },

    ResentPasswordOTP: async (): Promise<
        BaseResultWithData<UserAuth.OTPPasswordResponse>
    > => {
        try {
            return await api.post(API_URL.AUTH_REQUEST_CHANGE_PASSWORD);
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },

    ForgotPasswordOTP: async (
        data: Partial<UserAuth.RequestForgotPassword>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return api.post(API_URL.AUTH_REQUEST_FORGOT_PASSWORD, data);
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },

    ForgotPassword: async (
        data: Partial<UserAuth.ForgotPasswordRequest>
    ): Promise<BaseResultWithData<UserAuth.OTPPasswordResponse>> => {
        try {
            const response = await api.post(API_URL.AUTH_FORGOT_PASSWORD, data);
            return response.data;
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },

    ChangePassword: async (
        data: Partial<UserAuth.ChangePasswordRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(API_URL.AUTH_CHANGE_PASSWORD, data);
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },

    GetInfo: async (): Promise<BaseResultWithData<UserResponse>> => {
        try {
            return await api.get(API_URL.AUTH_GET_USER);
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },
};
