"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomeQuestionsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to new common questions page
        router.replace("/settings/common-questions");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-64">
            <p>Redirecting to Common Questions...</p>
        </div>
    );
}
