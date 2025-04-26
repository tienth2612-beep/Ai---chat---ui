"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as CompanyModel from "@/types/company";
import CompanyEmployeesClient from "./CompanyEmployeesClient";

export default function CompanyEmployeesViewPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [company, setCompany] = useState<CompanyModel.Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/companies/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch");
                    return res.json();
                })
                .then((data) => {
                    setCompany(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id]);

    if (!id) return <div>No company ID provided.</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!company) return <div>No company found.</div>;

    return (
        <div>
            <h1>{company.name}</h1>
            <CompanyEmployeesClient params={{ id }} />
        </div>
    );
}
