import AuthUserDetailsClient from "./auth-user-details-client";

/** Placeholder so `output: 'export'` has ≥1 prerender path; real IDs load client-side. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function AuthUserDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    return <AuthUserDetailsClient id={params.id} />;
}
