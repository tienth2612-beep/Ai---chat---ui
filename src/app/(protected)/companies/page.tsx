"use client";

import { useEffect, useState } from "react";
import { CompanyTable } from "@/components/company/company-table";
import { Company } from "@/types/company";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCompanies() {
            try {
                const response = await fetch("/api/companies");
                if (!response.ok) throw new Error("Failed to fetch companies");
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error("Error fetching companies:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCompanies();
    }, []);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : (
                <CompanyTable companies={companies} />
            )}
        </div>
    );
}
