import api from "../axios";
import { BaseResult, BaseResultWithData, PageResult } from "@/types/api";
import * as RbacModel from "@/types/rbac";
import { API_URL } from "../constants";

export const rbacService = {
    getListPermissions: async (
        data: Partial<RbacModel.GetPermissionsRequest>
    ): Promise<PageResult<RbacModel.PermissionResponse>> => {
        try {
            return await api.get(API_URL.PERMISSIONS, { params: data });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getPermission: async (
        id: number
    ): Promise<BaseResultWithData<RbacModel.PermissionResponse>> => {
        try {
            return await api.get(`${API_URL.PERMISSIONS}/${id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    createPermission: async (
        data: Partial<RbacModel.CreatePermissionRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(API_URL.PERMISSIONS, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    updatePermission: async (
        data: Partial<RbacModel.UpdatePermissionRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(`${API_URL.PERMISSIONS}/${data.id}`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getListRoles: async (
        data: Partial<RbacModel.GetRolesRequest>
    ): Promise<PageResult<RbacModel.RoleResponse>> => {
        try {
            return await api.get(API_URL.ROLES, {
                params: data,
            });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getRole: async (
        id: number
    ): Promise<BaseResultWithData<RbacModel.RoleResponse>> => {
        try {
            return await api.get(`${API_URL.ROLES}/${id}`);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    updateRole: async (
        data: Partial<RbacModel.UpdateRoleRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(`${API_URL.ROLES}/${data.id}`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    createRole: async (
        data: Partial<RbacModel.CreateRoleRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(API_URL.ROLES, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getAssignRole: async (
        id: number,
        data: Partial<Omit<RbacModel.GetAssignRequest, "id">>
    ): Promise<PageResult<RbacModel.PermissionResponse>> => {
        try {
            return await api.get(`${API_URL.ROLES}/${id}/assign`, {
                params: data,
            });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    createAssignRole: async (
        data: Partial<RbacModel.CreateAssignRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(
                `${API_URL.ROLES}/${data.objectId}/assign`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },
    updateAssignRole: async (
        data: Partial<RbacModel.UpdateAssignRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(`${API_URL.ROLES}/${data.id}/assign`, data);
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getListPackageRoles: async (
        packageId: number,
        data: Partial<Omit<RbacModel.GetPackageRolesRequest, "packageId">>
    ): Promise<PageResult<RbacModel.RoleResponse>> => {
        try {
            return await api.get(`${API_URL.PACKAGE_ROLES}/${packageId}/role`, {
                params: data,
            });
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    createPackageRole: async (
        data: Partial<RbacModel.CreatePackageRoleRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(
                `${API_URL.PACKAGE_ROLES}/${data.packageId}/role`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    updatePackageRole: async (
        data: Partial<RbacModel.UpdatePackageRoleRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(
                `${API_URL.PACKAGE_ROLES}/${data.packageId}/role`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    getAssignOfPackage: async (
        packageId: number,
        data: Partial<Omit<RbacModel.GetAssignRequest, "id">>
    ): Promise<PageResult<RbacModel.PermissionResponse>> => {
        try {
            return await api.get(
                `${API_URL.PACKAGE_ROLES}/${packageId}/assign`,
                {
                    params: data,
                }
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    createAssignOfPackage: async (
        data: Partial<RbacModel.CreateAssignRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.post(
                `${API_URL.PACKAGE_ROLES}/${data.objectId}/assign`,
                data
            );
        } catch (error: any) {
            if (error) {
                return error;
            }
            throw error;
        }
    },

    updateAssignOfPackage: async (
        data: Partial<RbacModel.UpdateAssignRequest>
    ): Promise<BaseResultWithData<boolean>> => {
        try {
            return await api.patch(
                `${API_URL.PACKAGE_ROLES}/${data.id}/assign`,
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
