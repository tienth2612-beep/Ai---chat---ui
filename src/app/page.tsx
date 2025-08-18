"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "@/hooks/use-auth-check";

export default function HomePage() {
    const { isLoading, user } = useAuthCheck();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                router.push("/dashboard");
            } else {
                router.push("/login");
            }
        }
    }, [user, isLoading, router]);

    return null;
}
