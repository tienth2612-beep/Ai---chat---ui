import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/client-cookies";
import * as UserModel from "@/types/user";

export function useAuthCheck() {
    const [user, setUser] = useState<UserModel.User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const session = getCookie("session");
        if (session) {
            setIsAuthenticated(true);
            setUser(JSON.parse(session) as UserModel.User);
        } else {
            setIsAuthenticated(false);
            setUser(null);
            router.push("/login");
        }
        setIsLoading(false);
    }, [router]);

    return { isAuthenticated, isLoading, user };
}
