import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
    // Check if the user is authenticated
    const session = await getSession();

    // Redirect to the appropriate page
    if (session) {
        // If authenticated, redirect to dashboard
        redirect("/dashboard");
    } else {
        // If not authenticated, redirect to login
        redirect("/login");
    }

    // This return is never reached but is needed for TypeScript
    return null;
}
