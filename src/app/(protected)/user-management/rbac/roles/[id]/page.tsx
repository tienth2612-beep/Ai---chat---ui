import RoleDetailPageClient from "./role-detail-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function RoleDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return <RoleDetailPageClient id={params.id} />;
}
