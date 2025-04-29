//#region "Request"
export interface GetAllCompanyRequest {
    fromDate: string;
    toDate: string;
    page: number;
    pageSize: number;
    search: string | null;
}

export interface GetCompanyRequest {
    userId: number;
    companyId: number;
}
//#endregion

//#region "Response"
export interface Company {
    id: string;
    name: string;
    email: string;
    role: string;
    membership: string;
    status: string;
}

export interface CompanyResponse {
    id: number;
    name?: string;
    description?: string;
    logo?: string;
    phone?: string;
    email?: string;
    website?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export interface DetailCompanyResponse {
    id: number;
    name: string | null;
    description: string | null;
    logo: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    businessHours: string | null;
    isShowBusinessHours: boolean;
    street1: string | null;
    street2: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
    timeZone: number;
    dateFormat: string | null;
    timeFormat: string | null;
    firstDayOfWeek: number;
    status: number;
}
//#endregion
