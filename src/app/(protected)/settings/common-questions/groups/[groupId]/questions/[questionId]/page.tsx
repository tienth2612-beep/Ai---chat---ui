import QuestionDetailsPageClient from "./question-details-page-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ groupId: "0", questionId: "0" }];
}

export default function QuestionDetailsPage({
    params,
}: {
    params: { groupId: string; questionId: string };
}) {
    return (
        <QuestionDetailsPageClient
            groupId={params.groupId}
            questionId={params.questionId}
        />
    );
}
