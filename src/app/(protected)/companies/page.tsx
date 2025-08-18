"use client";

import { CompanyTable } from "@/components/company/company-table";

export default function CompaniesPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
            </div>
            <CompanyTable />
        </div>
    );
}
