"use client";

import { useRouter } from "next/navigation";
import { CompanyChangeRequests } from "@/components/company/company-change-requests";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CompanyRequestsPageClient({ id }: { id: string }) {
    const router = useRouter();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Change Requests
                    </h2>
                </div>
            </div>
            <CompanyChangeRequests companyId={id} />
        </div>
    );
}
