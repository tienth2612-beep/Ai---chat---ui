"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonQuestionTable } from "@/components/common-questions/common-question-table";
import { CommonQuestionForm } from "@/components/common-questions/common-question-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { useCommonQuestions } from "@/hooks/use-common-questions";

export default function GroupQuestionsPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = Number(params.groupId);
    const { groups, fetchGroups } = useCommonQuestions();
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<any>(null);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    useEffect(() => {
        if (groups.length > 0) {
            const group = groups.find((g) => g.id === groupId);
            setCurrentGroup(group);
        }
    }, [groups, groupId]);

    const handleAddSuccess = () => {
        setShowAddModal(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/settings/common-questions")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Groups
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {currentGroup?.name || "Group Questions"}
                    </h2>
                    <p className="text-muted-foreground">
                        {currentGroup?.description ||
                            "Manage questions in this group."}
                    </p>
                </div>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Question
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Question</DialogTitle>
                            <DialogDescription>
                                Add a new question to this group.
                            </DialogDescription>
                        </DialogHeader>
                        <CommonQuestionForm
                            groupId={groupId}
                            onSuccess={handleAddSuccess}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <CommonQuestionTable groupId={groupId} />
        </div>
    );
}
