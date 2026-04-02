import AddPermissionsPageClient from "./add-permissions-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function AddPermissionsPage({
    params,
}: {
    params: { id: string };
}) {
    return <AddPermissionsPageClient id={params.id} />;
}
