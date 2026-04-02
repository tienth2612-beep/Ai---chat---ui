import CompanyRequestsPageClient from "./company-requests-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function CompanyRequestsPage({
    params,
}: {
    params: { id: string };
}) {
    return <CompanyRequestsPageClient id={params.id} />;
}
