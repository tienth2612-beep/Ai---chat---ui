"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Plus } from "lucide-react";
import { useCommonQuestions } from "@/hooks/use-common-questions";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AnswerForm } from "./answer-form";
import * as CommonQuestionModel from "@/types/commonQuestion";

export interface AnswerListProps {
    questionId: number;
    answers: CommonQuestionModel.AnswerResponse[] | null;
    onRefresh: () => void;
}

export function AnswerList({
    questionId,
    answers,
    onRefresh,
}: AnswerListProps) {
    const { toggleAnswerStatus } = useCommonQuestions();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAnswer, setEditingAnswer] =
        useState<CommonQuestionModel.AnswerResponse | null>(null);

    const handleStatusToggle = async (
        answer: CommonQuestionModel.AnswerResponse
    ) => {
        try {
            await toggleAnswerStatus(questionId, answer.id, {
                questionId,
                title: answer.title,
                code: answer.code,
                status: answer.status === 1 ? 0 : 1,
            });
            toast.success("Answer status updated successfully");
            onRefresh();
        } catch (error) {
            toast.error("Failed to update answer status");
        }
    };

    const handleEdit = (answer: CommonQuestionModel.AnswerResponse) => {
        setEditingAnswer(answer);
        setShowEditModal(true);
    };

    const handleAddSuccess = () => {
        setShowAddModal(false);
        onRefresh();
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setEditingAnswer(null);
        onRefresh();
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Answers</CardTitle>
                    <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Answer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Answer</DialogTitle>
                                <DialogDescription>
                                    Add a new answer option for this question.
                                </DialogDescription>
                            </DialogHeader>
                            <AnswerForm
                                questionId={questionId}
                                onSuccess={handleAddSuccess}
                                onCancel={() => setShowAddModal(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {!answers || answers.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            No answers found. Add some answers to get started.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {answers.map((answer) => (
                                <div
                                    key={answer.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium">
                                                {answer.title}
                                            </span>
                                            <Badge
                                                variant={
                                                    answer.status === 1
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {answer.status === 1
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </div>
                                        {answer.code && (
                                            <p className="text-sm text-muted-foreground">
                                                Code: {answer.code}
                                            </p>
                                        )}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleEdit(answer)
                                                }
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Answer
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleStatusToggle(answer)
                                                }
                                            >
                                                {answer.status === 1
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Answer</DialogTitle>
                        <DialogDescription>
                            Update the answer information.
                        </DialogDescription>
                    </DialogHeader>
                    <AnswerForm
                        questionId={questionId}
                        answer={editingAnswer || undefined}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditModal(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
