"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIndustry } from "@/hooks/use-industry";
import { formatDate } from "@/lib/utils";

// Nhận id trực tiếp dưới dạng string
export default function IndustryDetailsClient({ id }: { id: string }) {
    const router = useRouter();
    const { industry, isLoading, error, getIndustryById } = useIndustry();

    useEffect(() => {
        // Gọi API với id nhận được từ props
        if (id) {
            getIndustryById(id);
        }
    }, [id, getIndustryById]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!industry) return <div>Industry not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Industry Details</h3>
                    <p className="text-sm text-muted-foreground">View industry information.</p>
                </div>
                <Button onClick={() => router.push(`/settings/industries/${id}/edit`)}>
                    Edit Industry
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Industry Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Name</p><p>{industry.name}</p></div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <Badge variant={industry.status === 1 ? "default" : "secondary"}>
                                {industry.status === 1 ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <div><p className="text-sm font-medium text-muted-foreground">Created At</p><p>{formatDate(industry.createAt)}</p></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}