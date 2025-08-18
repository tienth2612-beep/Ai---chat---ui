"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { toast } from "sonner";
import { useCompany } from "@/hooks/use-company";
import * as UserModel from "@/types/user";
interface CompanyUserTableProps {
    companyId: string;
}

export function CompanyUserTable({ companyId }: CompanyUserTableProps) {
    const { users, totalUsers, getUserByCompanyId, isLoading } = useCompany();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    // Load initial data
    useEffect(() => {
        fetchUsers();
    }, [companyId]);

    // Function to fetch users
    const fetchUsers = async (
        search: string = searchTerm,
        page: number = currentPage,
        limit: number = itemsPerPage
    ) => {
        const filters: Partial<UserModel.GetAllUsersRequest> = {
            search,
            page,
            pageSize: limit,
        };
        try {
            await getUserByCompanyId(companyId, filters);
            setSearchTerm(searchTerm);
        } catch (error) {
            console.error("Error fetching company users:", error);
            toast.error("Failed to fetch company users");
        }
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page when search changes
        fetchUsers(searchTerm, 1, itemsPerPage);
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Handle search on Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        fetchUsers(searchTerm, page, itemsPerPage);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number.parseInt(value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when items per page changes
        fetchUsers(searchTerm, 1, newItemsPerPage);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="pr-10"
                    />
                </div>
                <Button onClick={handleSearch}>Search</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            {/* <TableHead className="text-right">
                                Actions
                            </TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span className="ml-2">
                                            Loading users...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    No users found in this company.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.status === 1
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.status === 1
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    {/* <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/users/${user.id}`}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        View User
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell> */}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            {totalUsers > 0 && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalUsers}
                    visibleItems={users.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
}
