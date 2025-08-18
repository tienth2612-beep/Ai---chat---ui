import api from "../axios";
import { BaseResultWithData, PageResult } from "@/types/api";
import * as UserModel from "@/types/user";
import { API_URL } from "../constants";

export const authUserService = {
    GetAllUser: async (
        data: Partial<UserModel.GetAllUsersRequest>
    ): Promise<PageResult<UserModel.UserResponse>> => {
        try {
            return api.get(API_URL.AUTH_USER, { params: data });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    getAuthUser: async (
        id: number
    ): Promise<BaseResultWithData<UserModel.UserResponse>> => {
        try {
            return api.get(`${API_URL.AUTH_USER}/${id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    updateAuthUser: async (
        id: number,
        data: Partial<UserModel.UserUpdateRequest>
    ): Promise<BaseResultWithData<UserModel.UserResponse>> => {
        try {
            return api.put(`${API_URL.AUTH_USER}/${id}`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    createAuthUser: async (
        data: Partial<UserModel.UserCreateRequest>
    ): Promise<BaseResultWithData<UserModel.UserResponse>> => {
        try {
            return api.post(API_URL.AUTH_USER, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    toggleAuthUserStatus: async (
        id: number,
        data: Partial<UserModel.ToggleStatusRequest>
    ): Promise<BaseResultWithData<UserModel.UserResponse>> => {
        try {
            return api.patch(`${API_URL.AUTH_USER}/${id}/toggle-status`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    inviteAuthUser: async (
        data: Partial<UserModel.UserInviteRequest>
    ): Promise<BaseResultWithData<UserModel.UserResponse>> => {
        try {
            return api.post(`${API_URL.AUTH_USER}/invite`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
};
