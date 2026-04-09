"use client";

import type { ReactNode } from "react";
import { Menu, Search, Bell, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

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
    const pageTitle = useMemo(() => "Dashboard", []);

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
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
                    <div className="flex items-center gap-3">
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
                        <h1 className="text-base md:text-lg font-bold text-zinc-900">
                            {pageTitle}
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center gap-3 w-full max-w-md mx-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                            <input
                                className="w-full rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Bell className="size-4 text-zinc-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Settings className="size-4 text-zinc-500" />
                        </Button>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
