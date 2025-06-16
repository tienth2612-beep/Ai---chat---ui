"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FileSpreadsheet,
    Download,
    Edit,
    Trash2,
    Check,
    TableIcon,
    Database,
    Calendar,
    User,
    FileText,
    Settings,
    Plus,
    Search,
    MoreHorizontal,
    RotateCcw,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { TemplateEditDialog } from "@/components/excel-setting/excel-template-edit";
import { Skeleton } from "@/components/ui/skeleton";
import { ExcelTemplateResponse } from "@/types/excel_config";
import { ExcelTemplateColumn } from "@/types/excel_config";
import { COMMON_STATUS, EXCEL_TARGET } from "@/lib/constants";
import { useExcel } from "@/hooks/use-excel";
import { number } from "zod";
import { toast } from "sonner";
import { ColumnEditDialog } from "./excel-template-column-edit";

interface TemplateDetailProps {
    templateId: string;
}
const EXCEL_TARGET_REVERSE_MAP = Object.fromEntries(
    Object.entries(EXCEL_TARGET).map(([key, value]) => [value, key])
) as Record<number, keyof typeof EXCEL_TARGET>;

export function TemplateDetail({ templateId }: TemplateDetailProps) {
    const {
        templateDetail,
        isLoading,
        getExcelTemplate,
        updateExcelTemplate,
        deleteExcelTemplate,
        getExcelTemplateColumns,
        deleteExcelTemplateColumn,
    } = useExcel();
    const [template, setTemplate] = useState<ExcelTemplateResponse | null>(
        null
    );
    const [filteredColumns, setFilteredColumns] = useState<
        ExcelTemplateColumn[]
    >([]);
    const [columns, setColumns] = useState<ExcelTemplateColumn[]>([]);
    const [loading, setLoading] = useState(true);
    const [columnsLoading, setColumnsLoading] = useState(true);
    const router = useRouter();

    // Column search and pagination states
    const [columnSearchTerm, setColumnSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Action states
    const [actionColumn, setActionColumn] =
        useState<ExcelTemplateColumn | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        fetchTemplate();
    }, [templateId]);

    useEffect(() => {
        filterColumns();
    }, [columns, columnSearchTerm]);

    useEffect(() => {
        // Reset to first page when search changes
        setCurrentPage(1);
    }, [columnSearchTerm]);

    const filterColumns = () => {
        let filtered = columns;

        // Search filter
        if (columnSearchTerm) {
            filtered = filtered.filter(
                (column) =>
                    column.columnName
                        .toLowerCase()
                        .includes(columnSearchTerm.toLowerCase()) ||
                    column.dataType
                        .toLowerCase()
                        .includes(columnSearchTerm.toLowerCase()) ||
                    column.mappedProperty
                        ?.toLowerCase()
                        .includes(columnSearchTerm.toLowerCase())
            );
        }

        setFilteredColumns(filtered);
    };

    const fetchTemplate = async () => {
        try {
            const result = await getExcelTemplate(Number(templateId));
            if (result) {
                setTemplate(result.excelTemplate);
                setColumns(result.excelTemplateColumns || []);
            } else {
                toast.error("Template not found");
                router.push("/settings/excel-templates");
            }
        } catch (error) {
            console.error("Failed to fetch template:", error);
            toast.error("Failed to fetch template details");
        } finally {
            setLoading(false);
            setColumnsLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            const request = {
                id: Number(templateId),
                status: COMMON_STATUS.ACTIVE,
            } as ExcelTemplateResponse;

            const response = await deleteExcelTemplate(
                Number(templateId),
                request
            );

            if (response) {
                toast.success("Template approved successfully");
                fetchTemplate(); // Refresh template data
            } else {
                throw new Error("Failed to approve template");
            }
        } catch (error) {
            toast.error("Failed to approve template");
        } finally {
            setShowDeleteDialog(false);
            setActionColumn(null);
        }
    };

    const handleDelete = async () => {
        try {
            const request = {
                id: Number(templateId),
                status: COMMON_STATUS.INACTIVE,
            } as ExcelTemplateResponse;

            const response = await deleteExcelTemplate(
                Number(templateId),
                request
            );

            if (response) {
                toast.success("Template deleted successfully");
                router.push("/settings/excel-templates");
            } else {
                throw new Error("Failed to delete template");
            }
        } catch (error) {
            toast.error("Failed to delete template");
        } finally {
            setShowDeleteDialog(false);
            setActionColumn(null);
        }
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case COMMON_STATUS.ACTIVE:
                return <Badge variant="default">Active</Badge>;
            case COMMON_STATUS.WAITING_APPROVE:
                return <Badge variant="secondary">Waiting Approve</Badge>;
            case COMMON_STATUS.INACTIVE:
                return <Badge variant="destructive">Inactive</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
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

    const getDataTypeBadge = (dataType: string) => {
        const colors = {
            string: "bg-blue-100 text-blue-800",
            number: "bg-green-100 text-green-800",
            date: "bg-purple-100 text-purple-800",
            boolean: "bg-orange-100 text-orange-800",
            email: "bg-cyan-100 text-cyan-800",
        };

        return (
            <Badge
                variant="outline"
                className={
                    colors[dataType as keyof typeof colors] ||
                    "bg-gray-100 text-gray-800"
                }
            >
                {dataType}
            </Badge>
        );
    };
    const handleDeleteColumn = async (columnIndex: number) => {
        try {
            const request = {
                status: COMMON_STATUS.INACTIVE,
            } as ExcelTemplateColumn;
            const response = await deleteExcelTemplateColumn(
                Number(templateId),
                columnIndex,
                request
            );

            if (response) {
                toast.success("Column deleted successfully");
                fetchTemplate(); // Refresh columns
            } else {
                throw new Error("Failed to delete column");
            }
        } catch (error) {
            toast.error("Failed to delete column");
        }
    };
    // Pagination calculations
    const totalPages = Math.ceil(filteredColumns.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedColumns = filteredColumns.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-16" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!template) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            Template not found
                        </h3>
                        <p className="text-muted-foreground">
                            The requested template could not be found.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Template Overview */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl">
                                    {template.name}
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <TemplateEditDialog
                                    template={template}
                                    onSave={fetchTemplate}
                                    trigger={
                                        <Button variant="outline">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    }
                                />

                                {template.status ===
                                    COMMON_STATUS.WAITING_APPROVE && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button>
                                                <Check className="mr-2 h-4 w-4" />
                                                Approve
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Approve Template
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to
                                                    approve "{template.name}"?
                                                    This will make it active and
                                                    available for use.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleApprove}
                                                >
                                                    Approve
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                {template.status !== COMMON_STATUS.INACTIVE && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete Template
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to
                                                    delete "{template.name}"?
                                                    This action cannot be
                                                    undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDelete}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                {template.status === COMMON_STATUS.INACTIVE && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline">
                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                Restore
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Restore Template
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to
                                                    restore "{template.name}"?
                                                    This will make it active and
                                                    available for use.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleApprove}
                                                >
                                                    Restore
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        Type
                                    </Label>
                                </div>
                                {getTypeBadge(template.type)}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Database className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        Target Table
                                    </Label>
                                </div>
                                <p className="text-sm capitalize">
                                    {EXCEL_TARGET_REVERSE_MAP[template.target]}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        Status
                                    </Label>
                                </div>
                                {getStatusBadge(template.status)}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <TableIcon className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        Sheet Name
                                    </Label>
                                </div>
                                <p className="text-sm">{template.sheetName}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        File Name
                                    </Label>
                                </div>
                                <p className="text-sm">{template.fileName}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        Uploaded
                                    </Label>
                                </div>
                                <p className="text-sm">
                                    {new Date(
                                        template.createAt
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        Function Mode
                                    </Label>
                                </div>
                                {template.isFunction ? (
                                    <Badge variant="default">Enabled</Badge>
                                ) : (
                                    <Badge variant="outline">Disabled</Badge>
                                )}
                            </div>

                            {template.isFunction && template.functionName && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        <Label className="text-sm font-medium">
                                            Function Name
                                        </Label>
                                    </div>
                                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                        {template.functionName}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Column Structure */}
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <CardTitle>Column Structure</CardTitle>
                                <CardDescription>
                                    Excel/CSV column definitions and data types
                                    for this template
                                </CardDescription>
                            </div>
                            <ColumnEditDialog
                                templateId={templateId}
                                onSave={fetchTemplate}
                                trigger={
                                    <Button variant="outline" size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Column
                                    </Button>
                                }
                            />
                        </div>
                        {columnsLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : columns.length === 0 ? (
                            <div className="text-center py-8">
                                <TableIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">
                                    No column data available
                                </h3>
                                <p className="text-muted-foreground">
                                    Column structure could not be determined for
                                    this template.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Search and Pagination Controls */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search columns..."
                                                value={columnSearchTerm}
                                                onChange={(e) =>
                                                    setColumnSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
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
                                                    <SelectItem value="5">
                                                        5
                                                    </SelectItem>
                                                    <SelectItem value="10">
                                                        10
                                                    </SelectItem>
                                                    <SelectItem value="20">
                                                        20
                                                    </SelectItem>
                                                    <SelectItem value="50">
                                                        50
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {columnSearchTerm && (
                                        <div className="text-sm text-muted-foreground">
                                            Showing {filteredColumns.length} of{" "}
                                            {columns.length} columns
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">
                                                    #
                                                </TableHead>
                                                <TableHead>
                                                    Column Name
                                                </TableHead>
                                                <TableHead>Data Type</TableHead>
                                                <TableHead>Required</TableHead>
                                                <TableHead>
                                                    Mapped Property
                                                </TableHead>
                                                <TableHead>
                                                    Validation Regex
                                                </TableHead>
                                                <TableHead className="text-right w-16">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedColumns.length > 0 ? (
                                                paginatedColumns.map(
                                                    (column, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-mono text-sm">
                                                                {index +
                                                                    (currentPage -
                                                                        1) *
                                                                        pageSize +
                                                                    1}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {
                                                                    column.columnName
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getDataTypeBadge(
                                                                    column.dataType
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {column.isRequired ? (
                                                                    <Badge
                                                                        variant="destructive"
                                                                        className="text-xs"
                                                                    >
                                                                        Required
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        Optional
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="max-w-xs">
                                                                <p
                                                                    className="text-sm text-muted-foreground truncate"
                                                                    title={
                                                                        column.mappedProperty
                                                                    }
                                                                >
                                                                    {column.mappedProperty ||
                                                                        "—"}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell className="text-xs text-muted-foreground">
                                                                {column.validationRegex ||
                                                                    "—"}
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
                                                                                Open
                                                                                menu
                                                                            </span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent
                                                                        align="end"
                                                                        className="w-40"
                                                                    >
                                                                        <DropdownMenuLabel>
                                                                            Actions
                                                                        </DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />

                                                                        <ColumnEditDialog
                                                                            column={
                                                                                column
                                                                            }
                                                                            templateId={
                                                                                templateId
                                                                            }
                                                                            onSave={
                                                                                fetchTemplate
                                                                            }
                                                                            trigger={
                                                                                <DropdownMenuItem
                                                                                    onSelect={(
                                                                                        e
                                                                                    ) =>
                                                                                        e.preventDefault()
                                                                                    }
                                                                                >
                                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                                    Edit
                                                                                    Column
                                                                                </DropdownMenuItem>
                                                                            }
                                                                        />

                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => {
                                                                                setActionColumn(
                                                                                    column
                                                                                );
                                                                                setShowDeleteDialog(
                                                                                    true
                                                                                );
                                                                            }}
                                                                            className="text-destructive focus:text-destructive"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={8}
                                                        className="h-24 text-center"
                                                    >
                                                        No columns match your
                                                        search.
                                                    </TableCell>
                                                </TableRow>
                                            )}
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
                                                filteredColumns.length
                                            )}{" "}
                                            of {filteredColumns.length} columns
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
                                                                totalPages -
                                                                4 +
                                                                i;
                                                        } else {
                                                            pageNumber =
                                                                currentPage -
                                                                2 +
                                                                i;
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
                                                onClick={() =>
                                                    goToPage(totalPages)
                                                }
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
            </div>
            {/* Delete Column Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Column</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the column "
                            {actionColumn?.columnName}"? This action cannot be
                            undone and may affect data processing.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                actionColumn &&
                                handleDeleteColumn(actionColumn.id)
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
