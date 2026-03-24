import { googleOAuthConfig } from "@/lib/config";
import * as AuthModel from "@/types/auth";

export interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export const googleAuthService = {
  // Initialize Google Identity Services
  initializeGoogleAuth: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Google Auth can only be initialized in browser"));
        return;
      }

      // Check if Google Identity Services is already loaded
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google?.accounts?.id) {
          resolve();
        } else {
          reject(new Error("Failed to load Google Identity Services"));
        }
      };
      
      script.onerror = () => {
        reject(new Error("Failed to load Google Identity Services script"));
      };

      document.head.appendChild(script);
    });
  },

  // Configure Google Sign-In
  configureGoogleSignIn: (callback: (response: GoogleAuthResponse) => void) => {
    if (!window.google?.accounts?.id) {
      throw new Error("Google Identity Services not loaded");
    }

    window.google.accounts.id.initialize({
      client_id: googleOAuthConfig.clientId,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  },

  // Render Google Sign-In button
  renderGoogleButton: (elementId: string, options?: {
    theme?: "outline" | "filled_blue" | "filled_black";
    size?: "large" | "medium" | "small";
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    shape?: "rectangular" | "pill" | "circle" | "square";
    width?: number;
  }) => {
    if (!window.google?.accounts?.id) {
      throw new Error("Google Identity Services not loaded");
    }

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: options?.theme || "outline",
        size: options?.size || "large",
        text: options?.text || "signin_with",
        shape: options?.shape || "rectangular",
        width: options?.width || 250,
      }
    );
  },

  // Decode JWT token to get user info
  decodeJWT: (token: string): GoogleUserInfo => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error("Failed to decode JWT token");
    }
  },

  // Send Google token to backend for authentication
  authenticateWithGoogle: async (data: AuthModel.GoogleLoginResponse): Promise<AuthModel.UserAuthResponse> => {
    // Import userServices here to avoid circular dependency
    const { authService } = await import("@/lib/service/auth.service");

    var response = await authService.googleLogin(data);
    return response.data as AuthModel.UserAuthResponse;
  },

  // Sign out from Google
  signOut: () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  },
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          disableAutoSelect: () => void;
          prompt: () => void;
        };
      };
    };
  }
} 