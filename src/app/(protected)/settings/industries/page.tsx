"use client";

import { IndustryTable } from "@/components/industries/industry-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function IndustriesPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Industries
                </h2>
                <div className="flex items-center space-x-2">
                    <Link href="/settings/industries/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Industry
                        </Button>
                    </Link>
                </div>
            </div>
            <IndustryTable />
        </div>
    );
}
