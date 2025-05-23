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

    //client
    CLIENT: "Client",

    //quote
    QUOTE: "Quote",
    EXTERNAL: "external",

    //job
    JOB: "Job",

    //Product/Service item
    COMPANY_SERVICE: "Service",

    //invoice
    INVOICE: "Invoices",

    //team member
    TEAM_MEMBER: "TeamMembers",

    //payment method
    PAYMENT_METHOD: "PaymentMethods",

    //tax
    TAX: "Taxes",
};

export const WELCOME_QUESTION_TYPE = {
    SINGLE_CHOICE: 0,
    MULTIPLE_CHOICE: 1,
};

export const COMMON_STATUS = {
    ACTIVE: 1,
    INACTIVE: 0,
};
