"use client";

import { WelcomeQuestionForm } from "@/components/welcome-questions/welcome-question-form";

export default function NewWelcomeQuestionPage() {
    return (
        <div className="max-w-xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-2">Create New Question</h2>
            <p className="text-muted-foreground mb-6">
                Fill in the details to create a new welcome question.
            </p>
            <WelcomeQuestionForm />
        </div>
    );
}
