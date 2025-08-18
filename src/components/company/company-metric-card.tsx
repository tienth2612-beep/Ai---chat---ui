import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CompanyMetricCardProps {
    title: string;
    value: string;
    count?: number;
    icon: ReactNode;
    className?: string;
}

export function CompanyMetricCard({
    title,
    value,
    count,
    icon,
    className,
}: CompanyMetricCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center">
                            {title}
                            {count !== undefined && (
                                <span className="ml-1 text-xs text-muted-foreground">
                                    ({count})
                                </span>
                            )}
                        </p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <div className="text-muted-foreground">{icon}</div>
                </div>
            </CardContent>
        </Card>
    );
}
