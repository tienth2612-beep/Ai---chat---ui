import { TemplateDetail } from "@/components/excel-setting/excel-template-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TemplateDetailPageProps {
    params: {
        id: string;
    };
}

export default function TemplateDetailPage({
    params,
}: TemplateDetailPageProps) {
    return (
        <>
            {/* <main className="container mx-auto py-10 px-4 md:px-6"> */}
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
            <TemplateDetail templateId={params.id} />
            {/* </main> */}
        </>
    );
}
