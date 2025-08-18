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
    User,
    Shield,
    UserCheck,
    Calendar,
    ChevronDown,
    ChevronUp,
    Copy,
    CheckCircle2,
    ExternalLink,
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
import * as UserModel from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { CompanyPaymentHistory } from "./company-payment-history";
import { CompanyUserInfoCard } from "./company-user-info-card";
interface CompanyDetailProps {
    companyId: string;
}
interface BusinessHour {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
}

export function CompanyDetail({ companyId }: CompanyDetailProps) {
    const router = useRouter();
    const {
        users,
        isLoading,
        error,
        companyActiveWork,
        companyMetrics,
        totalUsers,
        getCompanyById,
        getCompanyMetrics,
        getCompanyActiveWork,
        getUserByCompanyId,
    } = useCompany();
    const [company, setCompany] =
        useState<CompanyModel.DetailCompanyResponse | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [owner, setOwner] = useState<UserModel.UserResponse | undefined>(
        undefined
    );
    const [admin, setAdmin] = useState<UserModel.UserResponse | undefined>(
        undefined
    );
    const [showAllHours, setShowAllHours] = useState(false);
    useEffect(() => {
        async function fetchCompany() {
            try {
                const filters: Partial<UserModel.GetAllUsersRequest> = {
                    search: "",
                    page: 1,
                    pageSize: 100,
                };
                const companyData = await getCompanyById(companyId);
                const companyActiveWorkData = await getCompanyActiveWork(
                    companyId
                );
                const companyMetricsData = await getCompanyMetrics(companyId);
                const users = await getUserByCompanyId(companyId, filters);
                if (users && users.length > 0) {
                    const owner = users.find((x) => x.role === 5);
                    setOwner(owner);
                    const admin = users.find((x) => x.role === 1);
                    setAdmin(admin);
                }

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

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };
    const formatTime = (time: string) => {
        // Convert 24h format to 12h format if needed
        if (company?.timeFormat?.includes("hh:mm A")) {
            const [hours, minutes] = time.split(":");
            const hour = Number.parseInt(hours, 10);
            const ampm = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        }
        return time;
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return (
                    <Badge className="bg-green-500 hover:bg-green-600">
                        Active
                    </Badge>
                );
            case 0:
            default:
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        Inactive
                    </Badge>
                );
        }
    };
    // Parse business hours from JSON string
    const businessHours: BusinessHour[] = company?.businessHours
        ? JSON.parse(company.businessHours)
        : [];

    // Sort business hours to start with the first day of the week
    const sortedBusinessHours = [...businessHours].sort((a, b) => {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const firstDay = company?.firstDayOfWeek || 0;

        const aIndex = days.indexOf(a.day);
        const bIndex = days.indexOf(b.day);

        const aAdjusted = (aIndex - firstDay + 7) % 7;
        const bAdjusted = (bIndex - firstDay + 7) % 7;

        return aAdjusted - bAdjusted;
    });
    const getFullAddress = () => {
        if (!company) return "";
        const parts = [
            company.street1,
            company.street2,
            company.city,
            company.state,
            company.zipCode,
            company.country,
        ].filter(Boolean);

        return parts.join(", ");
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
                        {/* <div className="hidden sm:block">
                            {company.description && (
                                <p className="max-w-md text-muted-foreground">
                                    {company.description}
                                </p>
                            )}
                        </div> */}
                    </div>
                    <div className="grid gap-6 md:grid-cols-3 mt-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Industry
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {company.industries || "Unknown"}
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
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Address
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {company.city ?? " "}{" "}
                                        {company.state ?? " "}
                                        {/* {company.zipCode ?? ""} */}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {owner && <CompanyUserInfoCard user={owner} />}
                            {admin && <CompanyUserInfoCard user={admin} />}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
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
                <CompanyMetricCard
                    title="Team Members"
                    value={`${
                        users.filter((x) => x.status === 1).length
                    } Members active`}
                    count={totalUsers}
                    icon={<Users className="h-5 w-5" />}
                />
            </div>

            <Tabs
                defaultValue="active"
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <TabsList className="grid w-full grid-cols-2 lg:w-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>
                                    Basic contact details for this company
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            Phone
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`tel:${company.phone}`}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {company.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            Email
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`mailto:${company.email}`}
                                                className="text-muted-foreground hover:text-foreground transition-colors break-all"
                                            >
                                                {company.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {company.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">
                                                Website
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`https://${company.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                                                >
                                                    {company.website}
                                                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Address</CardTitle>
                                <CardDescription>
                                    Physical location of this company
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm">
                                            Address
                                        </p>
                                        <div className="text-muted-foreground space-y-1">
                                            <p>{company.street1}</p>
                                            {company.street2 && (
                                                <p>{company.street2}</p>
                                            )}
                                            <p>
                                                {company.city}, {company.state}{" "}
                                                {company.zipCode}
                                            </p>
                                            <p>{company.country}</p>
                                        </div>
                                        <div className="mt-3">
                                            <a
                                                href={`https://maps.google.com/?q=${encodeURIComponent(
                                                    getFullAddress()
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm text-primary hover:text-primary/80"
                                            >
                                                View on Google Maps
                                                <ExternalLink className="h-3.5 w-3.5 ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Business Hours</CardTitle>
                            <CardDescription>
                                Operating hours for this company
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {sortedBusinessHours
                                    .slice(
                                        0,
                                        showAllHours
                                            ? sortedBusinessHours.length
                                            : 3
                                    )
                                    .map((hour) => (
                                        <div
                                            key={hour.day}
                                            className="flex justify-between items-center p-3 rounded-lg border"
                                        >
                                            <div className="font-medium">
                                                {hour.day}
                                            </div>
                                            {hour.isOpen ? (
                                                <div className="text-sm">
                                                    {formatTime(hour.openTime)}{" "}
                                                    -{" "}
                                                    {formatTime(hour.closeTime)}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground">
                                                    Closed
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>

                            {sortedBusinessHours.length > 3 && (
                                <Button
                                    variant="ghost"
                                    className="mt-4 w-full"
                                    onClick={() =>
                                        setShowAllHours(!showAllHours)
                                    }
                                >
                                    {showAllHours ? (
                                        <>
                                            <ChevronUp className="h-4 w-4 mr-2" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4 mr-2" />
                                            Show All Hours
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                            <CardDescription>
                                Recent payment records
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CompanyPaymentHistory companyId={company.id} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
