export interface GetQuotesRequest {
    companyId: number;
    page: number;
    pageSize: number;
    search: string | null;
}

export interface QuotesResponse {
    id: number;
    clientId: number;
    quoteNo: string | null;
    phone: string | null;
    email: string | null;
    name: string | null;
    address: string | null;
    title: string | null;
    total: number;
    tax: number;
    taxRate: number;
    discount: number;
    discountPercentage: number;
    subtotal: number;
    requireDeposit: number;
    requireDepositPercentage: number;
    status: number;
    dueDate: string;
    createAt: string;
    updateAt: string;
}
