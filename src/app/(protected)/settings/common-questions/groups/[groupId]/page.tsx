import GroupQuestionsPageClient from "./group-questions-page-client";

/** Required for `output: 'export'`. IDs are resolved at runtime on the client. */
export function generateStaticParams() {
    return [{ groupId: "0" }];
}

export default function GroupQuestionsPage({
    params,
}: {
    params: { groupId: string };
}) {
    return <GroupQuestionsPageClient groupId={params.groupId} />;
}
