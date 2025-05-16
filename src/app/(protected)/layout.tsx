"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar/sidebar";
import { useAuthCheck } from "@/hooks/use-auth-check";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuthCheck();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar user={user} />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* <header className="flex h-16 items-center justify-between border-b px-6">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="md:hidden h-9 w-9 rounded-full border-primary/20"
                                    aria-label="Open menu"
                                >
                                    <Menu className="h-5 w-5 text-primary" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-[280px]">
                                <SheetTitle className="sr-only">
                                    Navigation Menu
                                </SheetTitle>
                                <Sidebar user={user} isMobile={true} />
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl font-bold">
                            Hi Tradies Management
                        </h1>
                    </div>
                </header> */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
