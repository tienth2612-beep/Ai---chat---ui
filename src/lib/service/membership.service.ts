import api from "../axios";
import { BaseResult, BaseResultWithData, PageResult } from "@/types/api";
import * as MembershipModel from "@/types/membership";
import { UserResponse } from "@/types/user";
import { API_URL } from "../constants";

export const membershipService = {
    getListMembership: async (
        data: Partial<MembershipModel.GetAllPackageRequest>
    ): Promise<PageResult<MembershipModel.PackageResponse>> => {
        try {
            return await api.get(API_URL.MEMBERSHIP, { params: data });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getMembershipById: async (
        id: string
    ): Promise<BaseResultWithData<MembershipModel.PackageResponse>> => {
        try {
            return await api.get(`${API_URL.MEMBERSHIP}/${id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getSubscriptionHistory: async (
        data: Partial<MembershipModel.GetSubscriptionHistoryRequest>
    ): Promise<PageResult<MembershipModel.SubscriptionHistoryResponse>> => {
        try {
            return await api.get(API_URL.SUBSCRIPTION_HISTORY, {
                params: data,
            });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    updatePackage: async (
        data: Partial<MembershipModel.CreateUpdatePackageRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(`${API_URL.MEMBERSHIP}/${data.id}`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    createPackage: async (
        data: Partial<MembershipModel.CreateUpdatePackageRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(API_URL.MEMBERSHIP, data);
        } catch (error: any) {
            if (error) {
                return error; // Trả về object từ backend
            }
            throw error;
        }
    },

    deletePackage: async (
        data: Partial<MembershipModel.DeletePackageRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.delete(`${API_URL.MEMBERSHIP}/${data.id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
};
