// 1. CHÚ Ý: Không có dòng "use client" ở đây
import EditMembershipClient from "./edit-membership-client";

// 2. THÊM HÀM NÀY: Để Next.js cho phép build tĩnh (output: export)
export function generateStaticParams() {
    return [{ id: "0" }];
}

// 3. Nhận params và truyền vào Component Client
export default function EditMembershipPage({ params }: { params: { id: string } }) {
    return <EditMembershipClient id={params.id} />;
}