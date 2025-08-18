import { IndustryForm } from "@/components/industries/industry-form";

export default function NewIndustryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create New Industry</h3>
                <p className="text-sm text-muted-foreground">
                    Add a new industry to the system.
                </p>
            </div>
            <IndustryForm />
        </div>
    );
}
