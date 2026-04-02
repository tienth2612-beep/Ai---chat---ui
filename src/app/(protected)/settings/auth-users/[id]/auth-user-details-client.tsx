"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthUser } from "@/hooks/use-auth-user";
import { formatDate } from "@/lib/utils";

// Nhận id trực tiếp dưới dạng string từ props
export default function AuthUserDetailsClient({ id }: { id: string }) {
    const router = useRouter();
    const { user, isLoading, error, getAuthUser } = useAuthUser();

    useEffect(() => {
        // Chỉ gọi API khi đã có id
        if (id) {
            getAuthUser(Number(id));
        }
    }, [id, getAuthUser]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">User Details</h3>
                    <p className="text-sm text-muted-foreground">View user information.</p>
                </div>
                <Button onClick={() => router.push(`/settings/auth-users/${id}/edit`)}>
                    Edit User
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Name</p><p>{user.name}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Email</p><p>{user.email}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Phone</p><p>{user.phone}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Company</p><p>{user.company?.name || "N/A"}</p></div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <Badge variant={user.status === 1 ? "default" : "secondary"}>
                                {user.status === 1 ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <div><p className="text-sm font-medium text-muted-foreground">Created At</p><p>{formatDate(user.createAt)}</p></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}