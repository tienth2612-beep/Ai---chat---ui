"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth.service";
import { setCookie, eraseCookie } from "@/lib/client-cookies";
import * as UserAuth from "@/types/auth";

// Hook
export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<Partial<UserAuth.UserAuthResponse> | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is authenticated
    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.GetInfo();

            if (response.isSuccess && response.data) {
                setUser({
                    userId: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                });
                return true;
            } else {
                setUser(null);
                return false;
            }
        } catch (error) {
            console.error("Auth check error:", error);
            setError("Failed to check authentication status");
            setUser(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Login
    const login = useCallback(
        async (data: UserAuth.LoginRequest) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authService.login(data);

                if (response.isSuccess && response.data) {
                    // Set user data
                    setUser({
                        userId: response.data.userId,
                        name: response.data.name,
                        email: response.data.email,
                        token: response.data.token,
                    });

                    // Store session in cookie
                    setCookie("session", JSON.stringify(response.data), 1); // 7 days

                    // Redirect to dashboard
                    router.push("/dashboard");
                    router.refresh();
                    return true;
                } else {
                    setError(response.message || "Invalid email or password");
                    return false;
                }
            } catch (error) {
                console.error("Login error:", error);
                setError("An unexpected error occurred. Please try again.");
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    // Google Login
    const googleLogin = useCallback(
        async (token: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authService.googleLogin({
                    credential: token,
                    referralCode: "",
                });

                if (response.isSuccess && response.data) {
                    // Set user data
                    setUser({
                        userId: response.data.userId,
                        name: response.data.name,
                        email: response.data.email,
                        token: response.data.token,
                    });

                    // Store session in cookie
                    setCookie("session", JSON.stringify(response.data), 1); // 7 days

                    // Redirect to dashboard
                    router.push("/dashboard");
                    router.refresh();
                    return true;
                } else {
                    setError(response.message || "Google login failed");
                    return false;
                }
            } catch (error) {
                console.error("Google login error:", error);
                setError("An unexpected error occurred. Please try again.");
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    // Register
    const register = useCallback(
        async (data: UserAuth.RegisterRequest) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authService.register(data);

                if (response.isSuccess && response.data) {
                    // Set user data
                    setUser({
                        userId: response.data.userId,
                        name: response.data.name,
                        email: response.data.email,
                        token: response.data.token,
                    });

                    // Store session in cookie
                    setCookie("session", JSON.stringify(response.data), 1); // 7 days

                    // Redirect to dashboard
                    router.push("/dashboard");
                    router.refresh();
                    return true;
                } else {
                    setError(response.message || "Registration failed");
                    return false;
                }
            } catch (error) {
                console.error("Registration error:", error);
                setError("An unexpected error occurred. Please try again.");
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    // Logout
    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await authService.logout();

            // Clear user data
            setUser(null);

            // Clear session cookie
            eraseCookie("session");

            // Redirect to login page
            router.push("/login");
            router.refresh();
            return true;
        } catch (error) {
            console.error("Logout error:", error);
            setError("Failed to log out");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
        googleLogin,
    };
}
