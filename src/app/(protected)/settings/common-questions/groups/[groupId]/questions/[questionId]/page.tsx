"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCommonQuestions } from "@/hooks/use-common-questions";
import { format } from "date-fns";
import { ArrowLeft, Edit } from "lucide-react";
import { COMMON_QUESTION_TYPE } from "@/lib/constants";
import { AnswerList } from "@/components/common-questions/answer-list";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CommonQuestionForm } from "@/components/common-questions/common-question-form";

export default function QuestionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = Number(params.groupId);
    const questionId = Number(params.questionId);

    const { questionDetail, loading, error, fetchQuestionDetail } =
        useCommonQuestions();

    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (questionId) {
            fetchQuestionDetail(questionId);
        }
    }, [questionId, fetchQuestionDetail]);

    const handleEditSuccess = () => {
        setShowEditModal(false);
        fetchQuestionDetail(questionId);
    };

    const handleRefresh = () => {
        fetchQuestionDetail(questionId);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!questionDetail) return <div>Question not found</div>;

    const { question, answers } = questionDetail;

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.push(
                                `/settings/common-questions/groups/${groupId}`
                            )
                        }
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Questions
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Question Details
                        </h2>
                        <p className="text-muted-foreground">
                            View and manage question information and answers.
                        </p>
                    </div>
                    <Button onClick={() => setShowEditModal(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Question
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Question Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <p className="mt-1">{question.title}</p>
                        </div>

                        {question.code && (
                            <div>
                                <label className="text-sm font-medium">
                                    Code
                                </label>
                                <p className="mt-1">{question.code}</p>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <p className="mt-1">
                                {question.type ===
                                COMMON_QUESTION_TYPE.SINGLE_CHOICE
                                    ? "Single Choice"
                                    : "Multiple Choice"}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Status
                            </label>
                            <div className="mt-1">
                                <Badge
                                    variant={
                                        question.status === 1
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {question.status === 1
                                        ? "Active"
                                        : "Inactive"}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">
                                    Created At
                                </label>
                                <p className="mt-1">
                                    {question.createAt
                                        ? format(
                                              new Date(question.createAt),
                                              "PPP"
                                          )
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Updated At
                                </label>
                                <p className="mt-1">
                                    {question.updateAt
                                        ? format(
                                              new Date(question.updateAt),
                                              "PPP"
                                          )
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <AnswerList
                    questionId={questionId}
                    answers={answers}
                    onRefresh={handleRefresh}
                />
            </div>

            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                        <DialogDescription>
                            Update the question information.
                        </DialogDescription>
                    </DialogHeader>
                    <CommonQuestionForm
                        groupId={groupId}
                        questionId={questionId}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditModal(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
