import { IndustryForm } from "@/components/industries/industry-form";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

interface EditIndustryPageProps {
    params: {
        id: string;
    };
}

export default function EditIndustryPage({ params }: EditIndustryPageProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Edit Industry</h3>
                <p className="text-sm text-muted-foreground">
                    Update industry information.
                </p>
            </div>
            <IndustryForm industryId={Number(params.id)} />
        </div>
    );
}
