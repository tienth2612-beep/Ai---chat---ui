"use client";

import { useParams } from "next/navigation";
import { WelcomeQuestionForm } from "@/components/welcome-questions/welcome-question-form";

export default function EditWelcomeQuestionPage() {
    const params = useParams();
    const questionId = Number(params.id);
    return (
        <div className="max-w-xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-2">Edit Question</h2>
            <p className="text-muted-foreground mb-6">
                Update the details for this welcome question.
            </p>
            <WelcomeQuestionForm questionId={questionId} />
        </div>
    );
}
