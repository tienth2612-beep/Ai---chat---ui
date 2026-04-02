"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomeQuestionRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Thực hiện chuyển hướng ngay khi trang load ở trình duyệt
        router.replace("/settings/common-questions");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-64">
            <p>Redirecting to Common Questions...</p>
        </div>
    );
}