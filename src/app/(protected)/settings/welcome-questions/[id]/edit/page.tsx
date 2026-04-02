import EditWelcomeQuestionRedirectClient from "./edit-welcome-question-redirect-client";

/** Required for `output: 'export'`. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function EditWelcomeQuestionPage() {
    return <EditWelcomeQuestionRedirectClient />;
}
