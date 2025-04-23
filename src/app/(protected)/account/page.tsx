import type { Metadata } from "next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Account Settings",
    description: "Manage your account settings and preferences",
};

export default async function AccountPage() {
    const user = await getCurrentUser();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Account Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your account preferences and settings.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Preferences</CardTitle>
                        <CardDescription>
                            Update your account preferences and settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label
                                htmlFor="two-factor"
                                className="flex flex-col space-y-1"
                            >
                                <span>Two-factor Authentication</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    Add an extra layer of security to your
                                    account.
                                </span>
                            </Label>
                            <Switch id="two-factor" />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <Label
                                htmlFor="email-notifications"
                                className="flex flex-col space-y-1"
                            >
                                <span>Email Notifications</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    Receive email notifications for important
                                    updates.
                                </span>
                            </Label>
                            <Switch id="email-notifications" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <Label
                                htmlFor="marketing"
                                className="flex flex-col space-y-1"
                            >
                                <span>Marketing Communications</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    Receive marketing emails and newsletters.
                                </span>
                            </Label>
                            <Switch id="marketing" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Session Management</CardTitle>
                        <CardDescription>
                            Manage your active sessions and devices.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">
                                        Current Session
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Last active: Just now
                                    </p>
                                </div>
                                <div className="flex h-2 w-2 rounded-full bg-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
