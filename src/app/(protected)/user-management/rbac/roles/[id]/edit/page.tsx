import EditRolePageClient from "./edit-role-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function EditRolePage({
    params,
}: {
    params: { id: string };
}) {
    return <EditRolePageClient id={params.id} />;
}
