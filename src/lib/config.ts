export const googleOAuthConfig = {
    clientId:
      process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ||
      "671238457153-a70io3il454a15on5opgpe6aag8rc0g3.apps.googleusercontent.com",
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    redirectUri:
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/google/callback`
        : "",
  };