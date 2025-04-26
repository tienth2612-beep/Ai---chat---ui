import { companyService } from "@/lib/service/company.service";
import { CompanyResponse, GetAllCompanyRequest } from "@/types/company";
import { User } from "@/types/user";

export const companyAction = {
    getCompanyDetail: async (id: number): Promise<CompanyResponse> => {
        const request: GetAllCompanyRequest = {
            page: 1,
            pageSize: 1,
            fromDate: "",
            toDate: "",
            search: id.toString(),
        };
        const response = await companyService.GetAllCompany(request);
        return response.data;
    },
    getEmployeesByCompanyId: async (id: number): Promise<User[]> => {
        const response = await companyService.GetAllUser(id, {});
        const userResponse = response.data;
        const users: User[] = Array.isArray(userResponse)
            ? userResponse.map((user) => ({
                  id: user.id.toString(),
                  name: user.name || "",
                  email: user.email || "",
                  role: user.company?.name || "",
                  membership: "basic",
                  status: user.status === 1 ? "active" : "inactive",
                  companyId: id,
                  createdAt: user.createAt,
              }))
            : [
                  {
                      id: userResponse.id.toString(),
                      name: userResponse.name || "",
                      email: userResponse.email || "",
                      role: userResponse.company?.name || "",
                      membership: "basic",
                      status: userResponse.status === 1 ? "active" : "inactive",
                      companyId: id,
                      createdAt: userResponse.createAt,
                  },
              ];
        return users;
    },
    getAllCompanies: async (): Promise<CompanyResponse[]> => {
        const request: GetAllCompanyRequest = {
            page: 1,
            pageSize: 100,
            fromDate: "",
            toDate: "",
            search: null,
        };
        const response = await companyService.GetAllCompany(request);
        return Array.isArray(response.data) ? response.data : [response.data];
    },
};
