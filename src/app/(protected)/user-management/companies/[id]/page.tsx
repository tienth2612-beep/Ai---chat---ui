// 1. XÓA DÒNG "use client" ở đây
import { CompanyDetail } from "@/components/company/company-detail";

// 2. THÊM HÀM NÀY: Bắt buộc để build SPA (output: export)
// Nó báo cho Next.js tạo 1 file HTML mẫu cho route này
export function generateStaticParams() {
    return [{ id: "0" }];
}

// 3. Nhận params trực tiếp qua props (Cách chuẩn của Next.js)
export default function ViewEmployeesPage({ params }: { params: { id: string } }) {
    // params.id lấy trực tiếp từ URL lúc chạy ở trình duyệt
    const id = params.id;

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Company Details
                </h2>
            </div>
            {/* Truyền id vào component con. 
                Component CompanyDetail của bạn vẫn có thể là "use client" bên trong file của nó */}
            <CompanyDetail companyId={id} />
        </div>
    );
}