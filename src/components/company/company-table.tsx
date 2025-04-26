"use client";

import Link from "next/link";
import { MoreHorizontal, View } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/types/company";

interface CompanyTableProps {
    companies: Company[];
}
export function CompanyTable({
    companies: initialCompanies,
}: CompanyTableProps) {
    //const [companies, setCompanies] = useState(initialCompanies);
    const companies = initialCompanies;
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companies.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No companies found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell className="font-medium">
                                    {company.name}
                                </TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell>{company.role}</TableCell>
                                <TableCell>{company.membership}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            company.status === "active"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {company.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/companies/${company.id}`}
                                                >
                                                    <View className="mr-2 h-4 w-4" />
                                                    View employees
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
