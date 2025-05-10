export interface InvoicesResponse {
    id: number;
    clientId: number;
    invoiceNo: string | null;
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
    paid: number;
    deposit: number;
    amountDue: number;
    paymentDue: string;
    paymentDate: string;
    issueDate: string;
    status: number;
    createAt: string;
    updateAt: string;
}

export interface GetInvoicesRequest {
    companyId: number;
    page: number;
    pageSize: number;
    search: string | null;
}
