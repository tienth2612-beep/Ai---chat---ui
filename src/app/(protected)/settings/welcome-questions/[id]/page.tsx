// 1. CHÚ Ý: Không có dòng "use client" ở đầu file này
import WelcomeQuestionRedirect from "./welcome-redirect-client";

// 2. THÊM HÀM NÀY: Để Next.js build ra file tĩnh cho folder [id]
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function WelcomeQuestionDetailsPage() {
    // 3. Gọi Component Client để thực hiện redirect
    return <WelcomeQuestionRedirect />;
}