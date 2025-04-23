"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DataTableSearchProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

export function DataTableSearch({
    placeholder = "Search...",
    value,
    onChange,
}: DataTableSearchProps) {
    return (
        <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                className="w-full pl-8"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
