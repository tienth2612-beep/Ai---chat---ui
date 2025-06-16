import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";

export const metadata: Metadata = {
    title: "RBAC Management",
    description: "Manage roles and permissions",
};

export default function RbacPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">
                    Role-Based Access Control
                </h3>
                <p className="text-sm text-muted-foreground">
                    Manage roles and permissions to control access to your
                    application.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Roles Management
                        </CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Roles</div>
                        <p className="text-xs text-muted-foreground">
                            Create and manage roles with specific permissions.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/user-management/rbac/roles">
                                Manage Roles
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Permissions Management
                        </CardTitle>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Permissions</div>
                        <p className="text-xs text-muted-foreground">
                            Create and manage individual permissions in the
                            system.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/user-management/rbac/permissions">
                                Manage Permissions
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
