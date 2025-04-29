"use client";
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
    LayoutDashboard,
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
    Building2,
    Key,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import * as UserAuth from "@/types/auth";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
    user: Partial<UserAuth.UserAuthResponse> | null;
    isMobile?: boolean;
}

export function Sidebar({ user, isMobile = false }: SidebarProps) {
    const { logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        router.refresh();
    };

    const handleNavigation = (href: string) => {
        router.push(href);
    };

    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        // {
        //     title: "Projects",
        //     href: "/dashboard/projects",
        //     icon: FolderKanban,
        // },
        // {
        //     title: "Analytics",
        //     href: "/dashboard/analytics",
        //     icon: BarChart,
        // },
        {
            title: "Companies",
            href: "/companies",
            icon: Building2,
        },
        {
            title: "Users",
            href: "/users",
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
                {/* Toggle Button - Only show on desktop */}
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
                        <div
                            className="flex items-center gap-3"
                            onClick={() => handleNavigation("/dashboard")}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                                <Home className="h-5 w-5 text-primary" />
                            </div>
                            <h1
                                className={cn(
                                    "text-xl font-bold tracking-tight transition-opacity duration-300",
                                    !isMobile && collapsed
                                        ? "opacity-0 w-0"
                                        : "opacity-100"
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
                                            <button
                                                onClick={() =>
                                                    handleNavigation(item.href)
                                                }
                                                className={cn(
                                                    "group relative flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        "h-5 w-5 shrink-0 transition-all",
                                                        !isMobile && collapsed
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
                                                        !isMobile && collapsed
                                                            ? "opacity-0 w-0"
                                                            : "opacity-100"
                                                    )}
                                                >
                                                    {item.title}
                                                </span>
                                                {isActive && (
                                                    <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-md" />
                                                )}
                                            </button>
                                        </TooltipTrigger>
                                        {!isMobile && collapsed && (
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
                    {user && (
                        <div className="border-t p-4">
                            <DropdownMenu>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <div
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 transition-all cursor-pointer",
                                                    !isMobile && collapsed
                                                        ? "justify-center"
                                                        : "justify-start"
                                                )}
                                            >
                                                <Avatar className="h-10 w-10 border-2 border-primary/10">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {user?.name?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {(!isMobile || isMobile) &&
                                                    (!collapsed ||
                                                        isMobile) && (
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">
                                                                {user?.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                                                                {user?.email}
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    {!isMobile && collapsed && (
                                        <TooltipContent side="right">
                                            <div>
                                                <p className="font-medium">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                                <DropdownMenuContent
                                    className="w-56"
                                    align={
                                        !isMobile && collapsed
                                            ? "center"
                                            : "start"
                                    }
                                    side={
                                        !isMobile && collapsed
                                            ? "right"
                                            : "bottom"
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
                                                handleNavigation("/profile")
                                            }
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>View Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleNavigation("/account")
                                            }
                                        >
                                            <UserCog className="mr-2 h-4 w-4" />
                                            <span>Account Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleNavigation(
                                                    "/account/change-password"
                                                )
                                            }
                                        >
                                            <Key className="mr-2 h-4 w-4" />
                                            <span>Change Password</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleNavigation("/billing")
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
                                                handleNavigation(
                                                    "/notifications"
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
                                                handleNavigation("/help")
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
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
