"use client";
import { useEffect, useState } from "react";
import { useWelcomeQuestions } from "@/hooks/use-welcome-questions";
import { Button } from "@/components/ui/button";
import { WelcomeQuestionTable } from "@/components/welcome-questions/welcome-question-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { WelcomeQuestionForm } from "@/components/welcome-questions/welcome-question-form";
import { PlusCircle } from "lucide-react";

export default function WelcomeQuestionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">
                    Welcome Questions
                </h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Question
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Question</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Add a new question to the system.
                        </DialogDescription>
                        <WelcomeQuestionForm />
                    </DialogContent>
                </Dialog>
            </div>
            <WelcomeQuestionTable />
        </div>
    );
}
