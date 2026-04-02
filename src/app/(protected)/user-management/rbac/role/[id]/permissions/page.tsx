import AssignPermissionsPageClient from "./assign-permissions-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function AssignPermissionsPage({
    params,
}: {
    params: { id: string };
}) {
    return <AssignPermissionsPageClient id={params.id} />;
}
