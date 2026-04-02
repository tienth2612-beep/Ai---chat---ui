import EditMembershipFormPageClient from "./edit-membership-form-page-client";

/** Required for `output: 'export'`: tells Next which `[id]` paths exist at build time. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function EditMembershipPage({
    params,
}: {
    params: { id: string };
}) {
    return <EditMembershipFormPageClient id={params.id} />;
}
