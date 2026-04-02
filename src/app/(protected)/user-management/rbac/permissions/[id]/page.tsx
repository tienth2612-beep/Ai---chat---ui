import { PermissionDetail } from "@/components/rbac/permission-detail";
import { Separator } from "@/components/ui/separator";

// 1. THÊM HÀM NÀY: Giúp vượt qua lỗi build "missing generateStaticParams"
export function generateStaticParams() {
    return [{ id: "0" }];
}

// 2. Nhận params trực tiếp từ Props (Cách chuẩn của Next.js)
export default function PermissionDetailPage({ params }: { params: { id: string } }) {
    // params.id ở đây chính là cái ID trên URL
    const id = params.id;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Permission Details</h3>
                <p className="text-sm text-muted-foreground">
                    View detailed information about this permission.
                </p>
            </div>
            <Separator />
            {/* Truyền id vào component con (component PermissionDetail vẫn có thể là "use client") */}
            <PermissionDetail id={id} />
        </div>
    );
}