"use client";

import { useEffect, useState, forwardRef } from "react";
import { useExcel } from "@/hooks/use-excel";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileSpreadsheet,
    Download,
    Edit,
    Trash2,
    View,
    Eye,
    Upload,
    MoreHorizontal,
    ChevronsRight,
    ChevronRight,
    ChevronLeft,
    ChevronsLeft,
    RotateCcw,
} from "lucide-react";
import {
    COMMON_STATUS,
    EXCEL_TARGET,
    getExcelTargetOptions,
} from "@/lib/constants";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Check, Filter, Search, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ExcelTemplateResponse } from "@/types/excel_config";
import { TemplateEditDialog } from "./excel-template-edit";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const EXCEL_TARGET_REVERSE_MAP = Object.fromEntries(
    Object.entries(EXCEL_TARGET).map(([key, value]) => [value, key])
) as Record<number, keyof typeof EXCEL_TARGET>;

export function ExcelTemplateManager() {
    const router = useRouter();
    const {
        templates,
        totalTemplates,
        templateDetail,
        getExcelTemplates,
        updateExcelTemplate,
        deleteExcelTemplate,
        isLoading,
    } = useExcel();
    const [filteredTemplates, setFilteredTemplates] = useState<
        ExcelTemplateResponse[]
    >([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [targetFilter, setTargetFilter] = useState("all");
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Action states
    const [actionTemplate, setActionTemplate] =
        useState<ExcelTemplateResponse | null>(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    useEffect(() => {
        loadTemplates();
    }, []);
    useEffect(() => {
        filterTemplates();
    }, [templates, searchTerm, typeFilter, statusFilter, targetFilter]);

    const loadTemplates = async () => {
        const response = await getExcelTemplates();
        if (response) {
            setFilteredTemplates(response);
        }
    };

    const handleDelete = async (templateId: number) => {
        try {
            const request = {
                id: templateId,
                status: COMMON_STATUS.INACTIVE,
            } as ExcelTemplateResponse;
            const response = await updateExcelTemplate(templateId, request);
            if (response) {
                toast.success("Template deleted successfully");
                loadTemplates();
            } else {
                throw new Error("Failed to delete template");
            }
        } catch (error) {
            toast.error("Failed to delete template");
        } finally {
            setShowApproveDialog(false);
            setActionTemplate(null);
        }
    };
    const getTypeBadge = (type: number) => {
        switch (type) {
            case 0:
                return <Badge variant="secondary">Export</Badge>;
            case 1:
                return <Badge variant="outline">Import</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };
    const getStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return <Badge variant="default">Active</Badge>;
            case 0:
                return <Badge variant="secondary">Waiting Approve</Badge>;
            case -1:
                return <Badge variant="secondary">Deleted</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };
    const getExcelTarget = (value: number) => {
        return EXCEL_TARGET_REVERSE_MAP[value];
    };
    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">Loading templates...</div>
                </CardContent>
            </Card>
        );
    }
    const handleApprove = async (templateId: string) => {
        try {
            const request = {
                id: Number(templateId),
                status: COMMON_STATUS.ACTIVE,
            } as ExcelTemplateResponse;
            const response = await updateExcelTemplate(
                Number(templateId),
                request
            );

            if (response) {
                toast.success("Template approved successfully");
                loadTemplates(); // Refresh the list
            } else {
                throw new Error("Failed to approve template");
            }
        } catch (error) {
            toast.error("Failed to approve template");
        } finally {
            setShowApproveDialog(false);
            setActionTemplate(null);
        }
    };
    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "Unknown";
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    };
    const filterTemplates = () => {
        let filtered = templates;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (template) =>
                    template.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    template.fileName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    template.sheetName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            //  setFilteredTemplates(filtered);
        }

        // Type filter
        if (typeFilter !== "all") {
            filtered = templates.filter(
                (template) => template.type === Number(typeFilter)
            );
            // setFilteredTemplates(filtered);
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = templates.filter(
                (template) => template.status === Number(statusFilter)
            );
            // setFilteredTemplates(filtered);
        }

        // Target filter
        if (targetFilter !== "all") {
            filtered = templates.filter(
                (template) => template.target === Number(targetFilter)
            );
            // setFilteredTemplates(filtered);
        }
        setFilteredTemplates(filtered);
    };
    const clearFilters = () => {
        setSearchTerm("");
        setTypeFilter("all");
        setStatusFilter("all");
        setTargetFilter("all");
        setFilteredTemplates(templates);
    };
    const hasActiveFilters =
        searchTerm ||
        typeFilter !== "all" ||
        statusFilter !== "all" ||
        targetFilter !== "all";

    const totalPages = Math.ceil(filteredTemplates.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Template Library</CardTitle>
                            <CardDescription>
                                Manage your uploaded templates and their
                                configurations.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() =>
                                router.push("/settings/excel-templates/new")
                            }
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New Template
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="space-y-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search templates..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={typeFilter}
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            setTypeFilter("all");
                                        } else {
                                            setTypeFilter(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="0">
                                            Export
                                        </SelectItem>
                                        <SelectItem value="1">
                                            Import
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            setStatusFilter("all");
                                        } else {
                                            setStatusFilter(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="1">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="0">
                                            Waiting Approve
                                        </SelectItem>
                                        <SelectItem value="-1">
                                            Deleted
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={targetFilter}
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            setTargetFilter("all");
                                        } else {
                                            setTargetFilter(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Target" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Targets
                                        </SelectItem>
                                        {getExcelTargetOptions().map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value.toString()}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>

                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearFilters}
                                        title="Clear filters"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            {hasActiveFilters && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Filter className="h-4 w-4" />
                                    <span>
                                        Showing {filteredTemplates.length} of{" "}
                                        {templates.length} templates
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-sm text-muted-foreground">
                                    Rows per page
                                </span>
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) => {
                                        setPageSize(Number(value));
                                        setCurrentPage(1); // Reset to first page
                                    }}
                                >
                                    <SelectTrigger className="w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-8">
                            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                {templates.length === 0
                                    ? "No templates found"
                                    : "No templates match your filters"}
                            </h3>
                            <p className="text-muted-foreground">
                                {templates.length === 0
                                    ? "Upload your first template to get started."
                                    : "Try adjusting your search or filters."}
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="mt-4"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Template Name</TableHead>
                                            <TableHead>Sheet</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Target</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>File</TableHead>
                                            <TableHead>Uploaded</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedTemplates.map((template) => (
                                            <TableRow key={template.id}>
                                                <TableCell className="font-medium">
                                                    {template.name}
                                                </TableCell>
                                                <TableCell>
                                                    {template.sheetName}
                                                </TableCell>
                                                <TableCell>
                                                    {getTypeBadge(
                                                        template.type
                                                    )}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {getExcelTarget(
                                                        template.target
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(
                                                        template.status
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {template.fileName}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        template.createAt
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48"
                                                        >
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(
                                                                        `/settings/excel-templates/${template.id}`
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>

                                                            <TemplateEditDialog
                                                                template={
                                                                    template
                                                                }
                                                                onSave={() =>
                                                                    loadTemplates()
                                                                }
                                                                trigger={
                                                                    <DropdownMenuItem>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                        Template
                                                                    </DropdownMenuItem>
                                                                }
                                                            />

                                                            {template.status ===
                                                            COMMON_STATUS.WAITING_APPROVE ? (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActionTemplate(
                                                                                template
                                                                            );
                                                                            setShowApproveDialog(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Check className="mr-2 h-4 w-4" />
                                                                        Approve
                                                                    </DropdownMenuItem>
                                                                </>
                                                            ) : null}

                                                            <DropdownMenuSeparator />
                                                            {template.status ===
                                                            COMMON_STATUS.INACTIVE ? (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActionTemplate(
                                                                                template
                                                                            );
                                                                            setShowRestoreDialog(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <RotateCcw className="mr-2 h-4 w-4" />
                                                                        Restore
                                                                    </DropdownMenuItem>
                                                                </>
                                                            ) : null}

                                                            <DropdownMenuSeparator />
                                                            {template.status !==
                                                            COMMON_STATUS.INACTIVE ? (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActionTemplate(
                                                                                template
                                                                            );
                                                                            setShowDeleteDialog(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </>
                                                            ) : null}

                                                            <DropdownMenuSeparator />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {startIndex + 1}-
                                        {Math.min(
                                            endIndex,
                                            filteredTemplates.length
                                        )}{" "}
                                        of {filteredTemplates.length} templates
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => goToPage(1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronsLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                goToPage(currentPage - 1)
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from(
                                                {
                                                    length: Math.min(
                                                        5,
                                                        totalPages
                                                    ),
                                                },
                                                (_, i) => {
                                                    let pageNumber;
                                                    if (totalPages <= 5) {
                                                        pageNumber = i + 1;
                                                    } else if (
                                                        currentPage <= 3
                                                    ) {
                                                        pageNumber = i + 1;
                                                    } else if (
                                                        currentPage >=
                                                        totalPages - 2
                                                    ) {
                                                        pageNumber =
                                                            totalPages - 4 + i;
                                                    } else {
                                                        pageNumber =
                                                            currentPage - 2 + i;
                                                    }

                                                    return (
                                                        <Button
                                                            key={pageNumber}
                                                            variant={
                                                                currentPage ===
                                                                pageNumber
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            size="icon"
                                                            onClick={() =>
                                                                goToPage(
                                                                    pageNumber
                                                                )
                                                            }
                                                            className="w-8 h-8"
                                                        >
                                                            {pageNumber}
                                                        </Button>
                                                    );
                                                }
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                goToPage(currentPage + 1)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => goToPage(totalPages)}
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
            <AlertDialog
                open={showApproveDialog}
                onOpenChange={setShowApproveDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Template</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve "
                            {actionTemplate?.name}"? This will make it active
                            and available for use.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                actionTemplate &&
                                handleApprove(actionTemplate.id.toString())
                            }
                        >
                            Approve
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "
                            {actionTemplate?.name}"? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                actionTemplate &&
                                handleDelete(actionTemplate.id)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
