import { FilterRequest } from "./api";

//#region Response
export interface PermissionResponse {
    id: number;
    permission: string;
    description: string;
    active: boolean;
    createBy: number;
    createAt: string;
    updateBy: number;
    updateAt: string;
    totalCount: number;
}
export interface PackageRoleResponse {
    id: number;
    packageId: number;
    roleId: number;
    active: boolean;
    createBy: number;
    createAt: string;
    updateBy: number;
    updateAt: string;
}

export interface AssignPermissionResponse {
    id: number;
    permissionId: number;
    objectId: number;
    active: boolean;
    createBy: number;
    createAt: string;
    updateBy: number;
    updateAt: string;
}

export interface RoleResponse {
    id: number;
    roleName: string;
    description: string;
    active: boolean;
    createBy: number;
    createAt: string;
    updateBy: number;
    updateAt: string;
    totalCount: number;
}
//#endregion

//#region Request
export interface GetPermissionsRequest extends FilterRequest {}
export interface GetRolesRequest extends FilterRequest {}
export interface GetPackageRolesRequest extends FilterRequest {
    packageId: number;
}
export interface GetAssignRequest extends FilterRequest {
    id: number;
}

export interface CreatePermissionRequest {
    permission: string;
    description: string | null;
}
export interface CreateRoleRequest {
    roleName: string;
    description: string | null;
}
export interface CreateAssignRequest {
    objectId: number;
    permissions: PermissionRequest[];
    type: number;
}

export interface PermissionRequest {
    permissionId: number;
}

export interface CreatePackageRoleRequest {
    packageId: number;
    roles: RoleRequest[];
}

export interface RoleRequest {
    roleId: number;
}

export interface UpdateAssignRequest {
    id: number;
    active: boolean;
}

export interface UpdatePackageRoleRequest {
    id: number;
    packageId: number;
    active: boolean;
}

export interface UpdatePermissionRequest {
    id: number;
    permission: string;
    description: string | null;
    active: boolean;
}

export interface UpdateRoleRequest {
    id: number;
    roleName: string;
    description: string | null;
    active: boolean;
}
//#endregion
