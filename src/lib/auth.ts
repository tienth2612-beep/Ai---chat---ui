import { cookies } from "next/headers";

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export type Session = User & {
    expires: string;
};

export async function getSession(): Promise<Session | null> {
    try {
        const sessionCookie = (await cookies()).get("session");

        if (!sessionCookie || !sessionCookie.value) {
            return null;
        }

        const session = JSON.parse(sessionCookie.value) as Session;

        //Check if session has expired
        if (new Date(session.expires) < new Date()) {
            return null;
        }

        return session;
    } catch (error) {
        console.error("Error parsing session:", error);
        return null;
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();

    if (!session) {
        return null;
    }

    return {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
    };
}
