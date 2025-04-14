"use client";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
    FolderKanban,
    LayoutDashboard,
    BarChart,
    Users,
    Settings,
    LogOut,
    Home,
    User,
    UserCog,
    CreditCard,
    Bell,
    HelpCircle,
    ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const user = {
    name: "John Doe",
    email: "john.doe@example.com",
};

export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        //await logoutAction();
        router.push("/login");
    };

    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Projects",
            href: "/dashboard/projects",
            icon: FolderKanban,
        },
        {
            title: "Analytics",
            href: "/dashboard/analytics",
            icon: BarChart,
        },
        {
            title: "Users",
            href: "/dashboard/users",
            icon: Users,
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ];

    return (
        <TooltipProvider delayDuration={0}>
            <div className="relative">
                {/* Toggle Button - Positioned to stay visible */}
                {!isMobile && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => setCollapsed(!collapsed)}
                                className={cn(
                                    "absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border shadow-md",
                                    collapsed ? "rotate-180" : ""
                                )}
                            >
                                <ChevronLeft size={14} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        </TooltipContent>
                    </Tooltip>
                )}

                <div
                    className={cn(
                        "group relative flex h-screen flex-col overflow-hidden border-r bg-gradient-to-b from-background via-background to-background/95 transition-all duration-300 ease-in-out",
                        isMobile ? "w-full" : collapsed ? "w-20" : "w-64"
                    )}
                >
                    {/* Header */}
                    <div className="flex h-16 items-center justify-start border-b px-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                                <Link
                                    href={"/"}
                                    className={cn(
                                        "group relative flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Home className="h-5 w-5 text-primary" />
                                </Link>
                            </div>
                            <h1
                                className={cn(
                                    "text-xl font-bold tracking-tight transition-opacity duration-300",
                                    collapsed ? "opacity-0 w-0" : "opacity-100"
                                )}
                            >
                                Hi Tradies
                            </h1>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="sidebar-scrollbar flex-1 overflow-y-auto py-6">
                        <nav className="space-y-1 px-3">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Tooltip key={item.href}>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "group relative flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        "h-5 w-5 shrink-0 transition-all",
                                                        collapsed
                                                            ? "mr-0"
                                                            : "mr-3",
                                                        isActive
                                                            ? "text-primary"
                                                            : "text-muted-foreground group-hover:text-foreground"
                                                    )}
                                                />
                                                <span
                                                    className={cn(
                                                        "truncate transition-opacity duration-300",
                                                        collapsed
                                                            ? "opacity-0 w-0"
                                                            : "opacity-100"
                                                    )}
                                                >
                                                    {item.title}
                                                </span>
                                                {isActive && (
                                                    <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-md" />
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        {collapsed && (
                                            <TooltipContent side="right">
                                                {item.title}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer with User Profile */}
                    <div className="border-t p-4">
                        <DropdownMenu>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <div
                                            className={cn(
                                                "flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 transition-all cursor-pointer",
                                                collapsed
                                                    ? "justify-center"
                                                    : "justify-start"
                                            )}
                                        >
                                            <Avatar className="h-10 w-10 border-2 border-primary/10">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {!collapsed && (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                {collapsed && (
                                    <TooltipContent side="right">
                                        <div>
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                            <DropdownMenuContent
                                className="w-56"
                                align={
                                    !isMobile && collapsed ? "center" : "start"
                                }
                                side={
                                    !isMobile && collapsed ? "right" : "bottom"
                                }
                                sideOffset={!isMobile && collapsed ? 20 : 5}
                            >
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            router.push("/dashboard/profile")
                                        }
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        <span>View Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            router.push("/dashboard/account")
                                        }
                                    >
                                        <UserCog className="mr-2 h-4 w-4" />
                                        <span>Account Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            router.push("/dashboard/billing")
                                        }
                                    >
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        <span>Billing</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            router.push(
                                                "/dashboard/notifications"
                                            )
                                        }
                                    >
                                        <Bell className="mr-2 h-4 w-4" />
                                        <span>Notifications</span>
                                        <DropdownMenuShortcut>
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                                3
                                            </span>
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            router.push("/dashboard/help")
                                        }
                                    >
                                        <HelpCircle className="mr-2 h-4 w-4" />
                                        <span>Help & Support</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
