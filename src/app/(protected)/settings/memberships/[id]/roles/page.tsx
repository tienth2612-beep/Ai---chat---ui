import MembershipAddRolesPageClient from "./membership-add-roles-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function MembershipAddRolesPage({
    params,
}: {
    params: { id: string };
}) {
    return <MembershipAddRolesPageClient id={params.id} />;
}
