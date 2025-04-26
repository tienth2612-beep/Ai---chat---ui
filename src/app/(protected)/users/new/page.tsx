import type { Metadata } from "next";
//import { UserForm } from "@/components/users/user-form";

export const metadata: Metadata = {
    title: "Create User",
    description: "Create a new user in the system",
};

export default function NewUserPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Create User
                </h2>
            </div>
            <div className="grid gap-4">{/* <UserForm /> */}</div>
        </div>
    );
}
