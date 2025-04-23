import type { Metadata } from "next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Profile",
    description: "User profile and settings",
};

export default async function ProfilePage() {
    const user = await getCurrentUser();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>
                                Update your personal information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium">Name</h3>
                                <p className="text-sm text-muted-foreground">
                                    {user?.name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium">Email</h3>
                                <p className="text-sm text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium">Role</h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="password" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you
                                will be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Password management form would go here.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                Configure how you receive notifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Notification preferences would go here.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
