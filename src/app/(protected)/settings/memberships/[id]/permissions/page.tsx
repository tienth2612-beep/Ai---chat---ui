import MembershipPermissionsPageClient from "./membership-permissions-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function MembershipPermissionsPage({
    params,
}: {
    params: { id: string };
}) {
    return <MembershipPermissionsPageClient id={params.id} />;
}
