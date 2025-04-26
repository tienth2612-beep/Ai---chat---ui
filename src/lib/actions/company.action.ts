import { companyService } from "../service/company.service";
import * as CompanyModel from "@/types/company";
import { GetAllCompanyRequest } from "@/types/company";
import * as UserModel from "@/types/user";
import { notFound } from "next/navigation";

export const companyAction = {
    getCompanyDetail: async (
        id: number
    ): Promise<CompanyModel.CompanyResponse> => {
        try {
            const request: GetAllCompanyRequest = {
                page: id,
                pageSize: 10,
                fromDate: "",
                toDate: "",
                search: "",
            };
            const response = await companyService.GetAllCompany(request);
            if (!response.isSuccess || !response.data) {
                notFound();
            }
            return response.data;
        } catch (error) {
            console.error("Get company detail error:", error);
            notFound();
        }
    },

    getEmployeesByCompanyId: async (id: number): Promise<UserModel.User[]> => {
        try {
            const response = await companyService.GetAllUser(id, {});
            if (!response.isSuccess || !response.data) {
                return [];
            }
            // Transform the response to match the User type
            return [
                {
                    id: response.data.id.toString(),
                    name: response.data.name || "",
                    email: response.data.email || "",
                    role: response.data.company?.name || "",
                    membership: "basic",
                    status: response.data.status === 1 ? "active" : "inactive",
                    companyId: id,
                    createdAt: response.data.createAt,
                },
            ];
        } catch (error) {
            console.error("Get employees by company ID error:", error);
            return [];
        }
    },
};
