//#region "Request"
export interface LoginRequest {
    Email: string;
    Password: string;
}

export interface ChangePasswordRequest {
    NewPassword: string;
    CurrentPassword: string;
    OTP: string;
}

export interface ForgotPasswordRequest {
    NewPassword: string;
    Email: string;
    OTP: string;
}

export interface RegisterRequest {
    Name: string;
    Password: string;
    Email: string;
}

export interface RequestChangePassword {
    UserId: number;
}

export interface RequestForgotPassword {
    email: string;
}
//#endregion End command

//#region "Response"
export interface UserAuthResponse {
    token: string;
    refreshToken: string;
    userId: number;
    email: string | null;
    name: string | null;
}

export interface OTPPasswordResponse {
    receiver: string;
    action: string;
    createAt: string;
    expired: string;
    resend: number;
    verify: number;
    resendAfter: number;
}

export type GoogleLoginResponse = {
    credential: string;
    referralCode: string;
  };
//#endregion
