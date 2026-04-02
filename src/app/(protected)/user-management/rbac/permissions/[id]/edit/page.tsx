import EditPermissionPageClient from "./edit-permission-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function EditPermissionPage({
    params,
}: {
    params: { id: string };
}) {
    return <EditPermissionPageClient id={params.id} />;
}
