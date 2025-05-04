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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCompany } from "@/hooks/use-company";
import { CompanyUserTable } from "./company-user-table";
import * as CompanyModel from "@/types/company";

interface CompanyDetailProps {
    companyId: string;
}

export function CompanyDetail({ companyId }: CompanyDetailProps) {
    const router = useRouter();
    const { getCompanyById, isLoading, error } = useCompany();
    const [company, setCompany] =
        useState<CompanyModel.DetailCompanyResponse | null>(null);

    useEffect(() => {
        async function fetchCompany() {
            try {
                const companyData = await getCompanyById(companyId);
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

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                {company.name}
                            </CardTitle>
                            <CardDescription>Company Details</CardDescription>
                        </div>
                        <Badge
                            variant={
                                company.status === 1 ? "default" : "secondary"
                            }
                            className="text-sm"
                        >
                            {company.status === 1 ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
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

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Company Users</h3>
                </div>
                <Separator />
                <CompanyUserTable companyId={companyId} />
            </div>
        </div>
    );
}
