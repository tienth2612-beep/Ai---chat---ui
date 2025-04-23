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
    Id: number;
    Name?: string;
    Description?: string;
    Logo?: string;
    Phone?: string;
    Email?: string;
    Website?: string;
    Street1?: string;
    Street2?: string;
    City?: string;
    State?: string;
    ZipCode?: string;
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
