import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/client-cookies";
import * as UserModel from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { googleAuthService } from "@/lib/service/googleAuth.service";
import { userKeys } from "@/lib/query/user.query";

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
export function useGoogleLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: googleAuthService.authenticateWithGoogle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.getProfile });
        },
    });
}
