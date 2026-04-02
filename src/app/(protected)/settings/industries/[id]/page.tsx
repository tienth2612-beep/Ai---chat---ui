// 1. KHÔNG có dòng "use client" ở đây
import IndustryDetailsClient from "./industry-details-client";

// 2. THÊM HÀM NÀY: Giúp vượt qua lỗi build "missing generateStaticParams"
export function generateStaticParams() {
    return [{ id: "0" }];
}

// 3. Nhận params và truyền vào Component Client
export default function IndustryDetailsPage({ params }: { params: { id: string } }) {
    return <IndustryDetailsClient id={params.id} />;
}