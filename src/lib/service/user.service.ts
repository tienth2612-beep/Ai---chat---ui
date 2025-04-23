import api from "../axios";
import { PageResult } from "@/types/api";
import * as UserModel from "@/types/user";
import { API_URL } from "../constants";

export const userService = {
    GetAllUser: async (
        data: Partial<UserModel.GetAllUsersRequest>
    ): Promise<PageResult<UserModel.UserResponse>> => {
        try {
            return api.get(API_URL.USER, { params: data });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
};
