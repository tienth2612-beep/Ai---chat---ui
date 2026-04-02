import { TemplateDetail } from "@/components/excel-setting/excel-template-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// 1. THÊM HÀM NÀY: Chìa khóa để build SPA (output: export) thành công.
// Nó báo cho Next.js tạo 1 file HTML mẫu cho folder [id] này.
export function generateStaticParams() {
    return [{ id: "0" }];
}

// 2. Nhận id trực tiếp từ params (dạng string, không cần mảng nữa)
interface TemplateDetailPageProps {
    params: {
        id: string;
    };
}

export default function TemplateDetailPage({
    params,
}: TemplateDetailPageProps) {
    // params.id ở đây chắc chắn là string
    const templateId = params.id;

    if (!templateId) {
        return <div>Template not found</div>;
    }

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/settings/excel-templates">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Template Details</h1>
                <p className="text-sm text-muted-foreground">
                    View detailed information and column structure of your
                    template.
                </p>
            </div>
            {/* Truyền templateId trực tiếp vào component con */}
            <TemplateDetail templateId={templateId} />
        </>
    );
}