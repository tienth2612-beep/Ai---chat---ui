import { Metadata } from "next";
import CompanyEmployeesClient from "./client";

export const metadata: Metadata = {
    title: "Company Employees",
};

// Generate static paths for all company IDs
export async function generateStaticParams() {
    // For static export, we'll generate a few sample paths
    return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function ViewEmployees({ params }: PageProps) {
    const resolvedParams = await params;
    return <CompanyEmployeesClient params={resolvedParams} />;
}
