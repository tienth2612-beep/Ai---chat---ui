export interface JobResponse {
    id: number;
    clientId: number;
    clientTitle: string | null;
    clientFirstName: string | null;
    clientLastName: string | null;
    clientPhone: string | null;
    clientEmail: string | null;
    companyId: number;
    title: string | null;
    instructions: string | null;
    status: number;
    addressId: number;
    address: string | null;
    type: number;
    startDate: string;
    endDate: string;
    endTime: string;
    repeat: number;
    duration: number;
    durationType: number;
    cron: string | null;
    note: string | null;
    invoiceType: number;
    isInvoiceNotification: boolean;
    isInvoiceLinked: boolean;
    jobNo: string;
    createAt: string;
    updateAt: string;
    repeatOptions: string;
    total: number;
    tax: number;
    taxRate: number;
    discount: number;
    discountPercentage: number;
    subtotal: number;
    requireDeposit: number;
    requireDepositPercentage: number;
}

export interface GetJobsRequest {
    companyId: number;
    page: number;
    pageSize: number;
    search: string | null;
}
