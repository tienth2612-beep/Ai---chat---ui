"use client";

import { useState, useCallback } from "react";
import * as RbacModel from "@/types/rbac";
import { rbacService } from "@/lib/service/rbac.service";

// Hook
export function useRbac() {
    const [permissions, setPermissions] = useState<
        RbacModel.PermissionResponse[]
    >([]);
    const [permissionsOfPackage, setPermissionsOfPackage] = useState<
        RbacModel.PermissionResponse[]
    >([]);
    const [rolesOfPackage, setRolesOfPackage] = useState<
        RbacModel.RoleResponse[]
    >([]);
    const [permissionsOfRole, setPermissionsOfRole] = useState<
        RbacModel.PermissionResponse[]
    >([]);
    const [permission, setPermission] =
        useState<RbacModel.PermissionResponse | null>(null);
    const [roles, setRoles] = useState<RbacModel.RoleResponse[]>([]);
    const [role, setRole] = useState<RbacModel.RoleResponse | null>(null);

    const [totalPermissions, setTotalPermissions] = useState(0);
    const [totalRoles, setTotalRoles] = useState(0);
    const [totalPermissionsOfPackage, setTotalPermissionsOfPackage] =
        useState(0);
    const [totalRolesOfPackage, setTotalRolesOfPackage] = useState(0);
    const [totalPermissionsOfRole, setTotalPermissionsOfRole] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get permissions with filters
    const getPermissions = useCallback(
        async (filters: Partial<RbacModel.GetPermissionsRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await rbacService.getListPermissions(filters);

                if (response.items && response) {
                    setPermissions(response.items);
                    setTotalPermissions(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch permissions");
                    return { permissions: [], total: 0 };
                }
            } catch (error) {
                console.error("Get permissions error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { permissions: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const getPermission = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await rbacService.getPermission(id);

            if (response.isSuccess && response.data) {
                setPermission(response.data);
                return response.data;
            } else {
                setError("Failed to fetch permissions");
                return null;
            }
        } catch (error) {
            console.error("Get permissions error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getRole = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await rbacService.getRole(id);

            if (response.isSuccess && response.data) {
                setRole(response.data);
                return response.data;
            } else {
                setError("Failed to fetch roles");
                return null;
            }
        } catch (error) {
            console.error("Get roles error:", error);
            setError("An unexpected error occurred. Please try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create permission
    const createPermission = useCallback(
        async (permissionData: Partial<RbacModel.CreatePermissionRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.createPermission(
                    permissionData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to create permission");
                    return null;
                }
            } catch (error) {
                console.error("Create permission error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Update permission
    const updatePermission = useCallback(
        async (permissionData: Partial<RbacModel.UpdatePermissionRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.updatePermission(
                    permissionData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to update permission");
                    return null;
                }
            } catch (error) {
                console.error("Update permission error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Get roles with filters
    const getRoles = useCallback(
        async (filters: Partial<RbacModel.GetRolesRequest> = {}) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await rbacService.getListRoles(filters);
                if (response.items && response) {
                    setRoles(response.items);
                    setTotalRoles(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch roles");
                    return { roles: [], total: 0 };
                }
            } catch (error) {
                console.error("Get roles error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { roles: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Create role
    const createRole = useCallback(
        async (roleData: Partial<RbacModel.CreateRoleRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.createRole(roleData);

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to create role");
                    return null;
                }
            } catch (error) {
                console.error("Create role error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Update role
    const updateRole = useCallback(
        async (roleData: Partial<RbacModel.UpdateRoleRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.updateRole(roleData);

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(response.message || "Failed to update role");
                    return null;
                }
            } catch (error) {
                console.error("Update role error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Get package roles
    const getPackageRoles = useCallback(
        async (
            packageId: number,
            filters: Partial<RbacModel.GetPackageRolesRequest> = {}
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await rbacService.getListPackageRoles(
                    packageId,
                    filters
                );
                console.log(response);
                if (response.items && response) {
                    setRolesOfPackage(response.items);
                    setTotalRolesOfPackage(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch roles");
                    return { roles: [], total: 0 };
                }
            } catch (error) {
                console.error("Get package roles error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { roles: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Create package role
    const createPackageRole = useCallback(
        async (
            packageRoleData: Partial<RbacModel.CreatePackageRoleRequest>
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.createPackageRole(
                    packageRoleData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(
                        response.message || "Failed to create package role"
                    );
                    return null;
                }
            } catch (error) {
                console.error("Create package role error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Update package role
    const updatePackageRole = useCallback(
        async (
            packageRoleData: Partial<RbacModel.UpdatePackageRoleRequest>
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.updatePackageRole(
                    packageRoleData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(
                        response.message || "Failed to update package role"
                    );
                    return null;
                }
            } catch (error) {
                console.error("Update package role error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Get role assignments
    const getRoleAssignments = useCallback(
        async (id: number, filters: Partial<RbacModel.GetAssignRequest>) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await rbacService.getAssignRole(id, filters);

                if (response.items && response) {
                    setPermissionsOfRole(response.items);
                    setTotalPermissionsOfRole(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch role assignments");
                    return { permissions: [], total: 0 };
                }
            } catch (error) {
                console.error("Get role assignments error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { permissions: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Create role assignment
    const createRoleAssignment = useCallback(
        async (assignmentData: Partial<RbacModel.CreateAssignRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.createAssignRole(
                    assignmentData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(
                        response.message || "Failed to create role assignment"
                    );
                    return null;
                }
            } catch (error) {
                console.error("Create role assignment error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Update role assignment
    const updateRoleAssignment = useCallback(
        async (assignmentData: Partial<RbacModel.UpdateAssignRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.updateAssignRole(
                    assignmentData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(
                        response.message || "Failed to update role assignment"
                    );
                    return null;
                }
            } catch (error) {
                console.error("Update role assignment error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Get role assignments
    const getAssignOfPackage = useCallback(
        async (
            packageId: number,
            filters: Partial<RbacModel.GetAssignRequest> = {}
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await rbacService.getAssignOfPackage(
                    packageId,
                    filters
                );

                if (response.items && response) {
                    setPermissionsOfPackage(response.items);
                    setTotalPermissionsOfPackage(response.totalCount);
                    return response.items;
                } else {
                    setError("Failed to fetch permissions of package");
                    return { permissions: [], total: 0 };
                }
            } catch (error) {
                console.error("Get permissions of package error:", error);
                setError("An unexpected error occurred. Please try again.");
                return { permissions: [], total: 0 };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Create role assignment
    const createAssignOfPackage = useCallback(
        async (assignmentData: Partial<RbacModel.CreateAssignRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.createAssignOfPackage(
                    assignmentData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(
                        response.message ||
                            "Failed to create permission of package"
                    );
                    return null;
                }
            } catch (error) {
                console.error("Create permission of package error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Update role assignment
    const updateAssignOfPackage = useCallback(
        async (assignmentData: Partial<RbacModel.UpdateAssignRequest>) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await rbacService.updateAssignOfPackage(
                    assignmentData
                );

                if (response.isSuccess && response.data) {
                    return response.data;
                } else {
                    setError(
                        response.message ||
                            "Failed to update permission of package"
                    );
                    return null;
                }
            } catch (error) {
                console.error("Update permission of package error:", error);
                setError("An unexpected error occurred. Please try again.");
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        permissions,
        roles,
        totalPermissions,
        totalRoles,
        isLoading,
        error,
        permission,
        role,
        permissionsOfPackage,
        rolesOfPackage,
        permissionsOfRole,
        totalPermissionsOfPackage,
        totalRolesOfPackage,
        totalPermissionsOfRole,
        getPermissions,
        createPermission,
        updatePermission,
        getRoles,
        createRole,
        updateRole,
        getPackageRoles,
        createPackageRole,
        updatePackageRole,
        getRoleAssignments,
        createRoleAssignment,
        updateRoleAssignment,
        getAssignOfPackage,
        createAssignOfPackage,
        updateAssignOfPackage,
        getPermission,
        getRole,
    };
}
