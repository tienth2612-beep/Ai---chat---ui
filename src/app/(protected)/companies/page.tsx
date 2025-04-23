import { CompanyTable } from "@/components/company/company-table";
import { mockCompanies } from "@/lib/mock-data";

export default function UsersPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
            </div>
            <CompanyTable companies={mockCompanies} />
        </div>
    );
}
