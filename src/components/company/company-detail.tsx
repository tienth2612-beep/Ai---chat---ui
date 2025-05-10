"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Building2,
    Users,
    Info,
    Receipt,
    FileText,
    Briefcase,
    ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCompany } from "@/hooks/use-company";
import { CompanyUserTable } from "./company-user-table";
import * as CompanyModel from "@/types/company";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { CompanyMetricCard } from "./company-metric-card";
import { CompanyQuotesTable } from "./company-quotes-table";
import { CompanyJobsTable } from "./company-jobs-table";
import { CompanyInvoicesTable } from "./company-invoices-table";
import { CompanyActiveTable } from "./company-active-table";

interface CompanyDetailProps {
    companyId: string;
}

export function CompanyDetail({ companyId }: CompanyDetailProps) {
    const router = useRouter();
    const {
        getCompanyById,
        isLoading,
        error,
        companyActiveWork,
        companyMetrics,
        getCompanyMetrics,
        getCompanyActiveWork,
    } = useCompany();
    const [company, setCompany] =
        useState<CompanyModel.DetailCompanyResponse | null>(null);
    const [activeTab, setActiveTab] = useState("active");

    useEffect(() => {
        async function fetchCompany() {
            try {
                const companyData = await getCompanyById(companyId);
                const companyActiveWorkData = await getCompanyActiveWork(
                    companyId
                );
                const companyMetricsData = await getCompanyMetrics(companyId);
                if (companyData) {
                    setCompany(companyData);
                } else {
                    toast.error("Failed to fetch company details");
                }
            } catch (error) {
                console.error("Error fetching company:", error);
                toast.error("Failed to fetch company details");
            }
        }

        fetchCompany();
    }, [companyId, getCompanyById]);

    const handleBack = () => {
        router.push("/companies");
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="flex h-[400px] w-full flex-col items-center justify-center space-y-4">
                <p className="text-lg font-medium text-destructive">
                    Failed to load company details
                </p>
                <Button onClick={handleBack}>Back to Companies</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleBack}>
                    Back
                </Button>
                {/* <Button onClick={handleEdit}>Edit Company</Button> */}
            </div>

            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {company.name}
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <Badge
                                        variant={
                                            company.status === 1
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="text-sm"
                                    >
                                        {company.status === 1
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            {company.description && (
                                <p className="max-w-md text-muted-foreground">
                                    {company.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 mt-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Industry
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {company.industries}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Company Size
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {company.totalMember}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <p className="text-sm text-muted-foreground">
                                        {company.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">
                                        {company.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Website
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        <a
                                            href={company.website ?? ""}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            {company.website ?? ""}
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Address
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {company.street1 ?? ""}
                                        {company.street2 ?? ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <CompanyMetricCard
                    title="Quotes"
                    value={`$${companyMetrics?.quoteTotal.toLocaleString()}`}
                    count={companyMetrics?.quoteCount}
                    icon={<FileText className="h-5 w-5" />}
                />
                <CompanyMetricCard
                    title="Jobs"
                    value={`$${companyMetrics?.jobTotal.toLocaleString()}`}
                    count={companyMetrics?.jobCount}
                    icon={<Briefcase className="h-5 w-5" />}
                />
                <CompanyMetricCard
                    title="Invoice"
                    value={`$${companyMetrics?.invoiceTotal.toLocaleString()}`}
                    count={companyMetrics?.invoiceCount}
                    icon={<Receipt className="h-5 w-5" />}
                />
            </div>

            <Tabs
                defaultValue="active"
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <TabsList className="grid w-full grid-cols-5 lg:w-auto">
                    <TabsTrigger value="active">Active Work</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>

                    <TabsTrigger value="quotes">Quotes</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                </TabsList>
                <TabsContent value="members" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>
                                    People working with this company
                                </CardDescription>
                            </div>
                            {/* <Button variant="outline" size="sm">
                                Add Member
                            </Button> */}
                        </CardHeader>
                        <CardContent>
                            <CompanyUserTable
                                companyId={company.id.toString()}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle>Recent Quotes</CardTitle>
                                    <CardDescription>
                                        Latest quotes for this company
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => setActiveTab("quotes")}
                                >
                                    View all{" "}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <CompanyActiveTable
                                    activeItems={companyActiveWork.filter(
                                        (item) => item.type === "quote"
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle>Active Jobs</CardTitle>
                                    <CardDescription>
                                        Current jobs in progress
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => setActiveTab("jobs")}
                                >
                                    View all{" "}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <CompanyActiveTable
                                    activeItems={companyActiveWork.filter(
                                        (item) => item.type === "job"
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle>Active Invoices</CardTitle>
                                    <CardDescription>
                                        Current invoices in progress
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => setActiveTab("invoices")}
                                >
                                    View all{" "}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <CompanyActiveTable
                                    activeItems={companyActiveWork.filter(
                                        (item) => item.type === "invoice"
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="quotes">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle>All Quotes</CardTitle>
                                <CardDescription>
                                    Manage company quotes
                                </CardDescription>
                            </div>
                            {/* <Button>Create Quote</Button> */}
                        </CardHeader>
                        <CardContent>
                            <CompanyQuotesTable companyId={company.id} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="jobs">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle>All Jobs</CardTitle>
                                <CardDescription>
                                    Manage company jobs
                                </CardDescription>
                            </div>
                            {/* <Button>Create Job</Button> */}
                        </CardHeader>
                        <CardContent>
                            <CompanyJobsTable companyId={company.id} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invoices">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle>All Invoices</CardTitle>
                                <CardDescription>
                                    Manage company invoices
                                </CardDescription>
                            </div>
                            {/* <Button>Create Invoice</Button> */}
                        </CardHeader>
                        <CardContent>
                            <CompanyInvoicesTable companyId={company.id} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
