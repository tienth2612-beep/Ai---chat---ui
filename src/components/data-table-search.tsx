"use client";

import type React from "react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const DateRangeModel: DateRange = {
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
};

interface DataTableSearchProps {
    placeholder?: string;
    onSearch: (params: {
        searchTerm: string;
        dateRange: DateRange | undefined;
    }) => void;
    initialSearchTerm?: string;
    initialDateRange?: DateRange;
}

export function DataTableSearch({
    placeholder = "Search...",
    onSearch,
    initialSearchTerm = "",
    initialDateRange = DateRangeModel,
}: DataTableSearchProps) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        initialDateRange
    );

    const handleSearch = () => {
        onSearch({ searchTerm, dateRange });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    const clearDateRange = () => {
        setDateRange(undefined);
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <DateRangePicker
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        className="w-[300px]"
                    />
                    {dateRange && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearDateRange}
                            className="h-9 w-9"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear date filter</span>
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex w-full gap-2 sm:max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={placeholder}
                        className="w-full pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <Button type="button" onClick={handleSearch}>
                    Search
                </Button>
            </div>
        </div>
    );
}
