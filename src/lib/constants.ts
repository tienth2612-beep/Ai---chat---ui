export const API_URL = {
    //auth
    AUTH_SIGN_UP: "auth/register",
    AUTH_LOGIN: "auth/login",
    AUTH_LOGOUT: "auth/logout",
    AUTH_REQUEST_FORGOT_PASSWORD: "auth/request-forgot-password",
    AUTH_REQUEST_CHANGE_PASSWORD: "auth/request-change-password",
    AUTH_FORGOT_PASSWORD: "auth/forgot-password",
    AUTH_CHANGE_PASSWORD: "auth/change-password",
    AUTH_GET_USER: "auth",
    AUTH_GOOGLE_LOGIN: "auth/google-login",

    //USer
    USER: "user",
    AUTH_USER: "authUser",

    //company
    COMPANY: "Company",

    //membership
    MEMBERSHIP: "package",
    SUBSCRIPTION_HISTORY: "package/subscription-history",

    //rbac
    PERMISSIONS: "rbac/permission",
    ROLES: "rbac/role",
    PACKAGE_ROLES: "rbac/package",

    //payment
    PAYMENT: "Payment",
    PAYMENT_HISTORY: "payment-history",

    //industry
    INDUSTRY: "industries",

    //common
    COUNTRIES: "Common/countries",
    TIMEZONES: "Common/timezones",

    //welcome question
    WELCOME_QUESTION: "welcomeQuestion",

    //excel
    UPLOAD_TEMPLATE: "setting/upload-template-excel",
    GET_TEMPLATES: "setting/templates-excel",
};

export const WELCOME_QUESTION_TYPE = {
    SINGLE_CHOICE: 0,
    MULTIPLE_CHOICE: 1,
};

export const COMMON_STATUS = {
    ACTIVE: 1,
    WAITING_APPROVE: 0,
    INACTIVE: -1,
};

export const EXCEL_TARGET = {
    NONE: 0,
    CLIENT: 1,
    QUOTE: 2,
    JOB: 3,
    INVOICE: 4,
    USER: 5,
};
export type ExcelTarget = (typeof EXCEL_TARGET)[keyof typeof EXCEL_TARGET];
export const EXCEL_TARGET_LABELS: Record<ExcelTarget, string> = {
    [EXCEL_TARGET.NONE]: "None",
    [EXCEL_TARGET.CLIENT]: "Client",
    [EXCEL_TARGET.QUOTE]: "Quote",
    [EXCEL_TARGET.JOB]: "Job",
    [EXCEL_TARGET.INVOICE]: "Invoice",
    [EXCEL_TARGET.USER]: "User",
};
export const getExcelTargetOptions = () => {
    return Object.entries(EXCEL_TARGET).map(([key, value]) => ({
        value,
        label: EXCEL_TARGET_LABELS[value],
        key,
    }));
};
