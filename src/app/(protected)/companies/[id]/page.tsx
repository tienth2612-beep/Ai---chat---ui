"use client";

import { useParams } from "next/navigation";
import { CompanyDetail } from "@/components/company/company-detail";

interface ViewEmployees {
    params: {
        id: number;
    };
}

export default function ViewEmployees() {
    const params = useParams();

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Company Details
                </h2>
            </div>
            <CompanyDetail companyId={params.id as string} />
        </div>
    );
}
