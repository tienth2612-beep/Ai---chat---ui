"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWelcomeQuestions } from "@/hooks/use-welcome-questions";
import { format } from "date-fns";
import { Info, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeQuestionForm } from "@/components/welcome-questions/welcome-question-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormMessage } from "@/components/ui/form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    code: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function WelcomeQuestionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const questionId = Number(params.id);
    const {
        questionDetail,
        loading,
        error,
        fetchQuestionDetail,
        saveAnswer,
        toggleAnswerStatus,
    } = useWelcomeQuestions();

    const [showModal, setShowModal] = useState(false);
    const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
    const [editingAnswer, setEditingAnswer] = useState<any>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            code: "",
        },
    });

    useEffect(() => {
        if (questionId) fetchQuestionDetail(questionId);
    }, [questionId, fetchQuestionDetail]);

    const handleEditAnswer = (a: any) => {
        setEditingAnswer(a);
        form.reset({
            title: a.title,
            code: a.code || "",
        });
        setShowModal(true);
    };

    const handleAddAnswer = () => {
        setEditingAnswer(null);
        form.reset({
            title: "",
            code: "",
        });
        setShowModal(true);
    };

    const onSubmit = async (values: FormValues) => {
        console.log(values);
        try {
            const data = {
                ...values,
                questionId: questionId,
                status: 1,
                code: values.code || null,
            };
            await saveAnswer(
                questionId,
                data,
                editingAnswer ? editingAnswer?.id : undefined
            );
            toast.success(editingAnswer ? "Answer updated" : "Answer created");
            setEditingAnswer(null);
            setShowModal(false);
            fetchQuestionDetail(questionId);
        } catch (err: any) {
            toast.error(err?.message || "Failed to save answer");
        }
    };

    const handleToggleAnswer = async (a: any) => {
        try {
            await toggleAnswerStatus(questionId, a.id, {
                ...a,
                status: a.status === 1 ? 0 : 1,
            });
            toast.success("Status updated");
            fetchQuestionDetail(questionId);
        } catch {}
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!questionDetail) return null;

    const q = questionDetail.question;

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Question Details</h2>
                <Button
                    variant="outline"
                    onClick={() => router.push("/settings/welcome-questions")}
                >
                    Back
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Title: {q.title}</CardTitle>
                        <div className="mt-4">
                            <Button
                                onClick={() => setShowEditQuestionModal(true)}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                Question
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground mb-2">
                        Code: {q.code || "-"}{" "}
                        {q.type === 0 ? "(Single Choice)" : "(Multiple Choice)"}
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                        <Badge
                            variant={q.status === 1 ? "default" : "secondary"}
                        >
                            {q.status === 1 ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-muted-foreground text-sm">
                            Created:{" "}
                            {q.createAt
                                ? format(new Date(q.createAt), "yyyy-MM-dd")
                                : "-"}
                        </span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Answers</CardTitle>
                        <div className="mt-4">
                            <Button onClick={handleAddAnswer}>
                                <Plus className="mr-2 h-4 w-4" /> Add Answer
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {questionDetail.answers?.map((a) => (
                            <div
                                key={a.id}
                                className="flex items-center justify-between border rounded p-2"
                            >
                                <span className="flex items-center gap-2">
                                    {a.title.length > 50
                                        ? a.title.slice(0, 50) + "..."
                                        : a.title}
                                    {a.title.length > 50 && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-4 h-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {a.title}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </span>
                                <Badge
                                    variant={
                                        a.status === 1 ? "default" : "secondary"
                                    }
                                    className="ml-2"
                                >
                                    {a.status === 1 ? "Active" : "Inactive"}
                                </Badge>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            form.reset({
                                                title: a.title,
                                                code: a.code || "",
                                            });
                                            setEditingAnswer(a);
                                            setShowModal(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleToggleAnswer(a)}
                                    >
                                        {a.status === 1
                                            ? "Deactivate"
                                            : "Activate"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {/* Add Answer Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingAnswer ? "Edit" : "Add"} Answer
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Code"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            form.reset({
                                                title: "",
                                                code: "",
                                            });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button type="submit" disabled={loading}>
                                    {loading
                                        ? "Saving..."
                                        : editingAnswer
                                        ? "Update"
                                        : "Save"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showEditQuestionModal}
                onOpenChange={setShowEditQuestionModal}
                modal={true}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                    </DialogHeader>
                    <WelcomeQuestionForm
                        questionId={questionId}
                        onSuccess={() => {
                            setShowEditQuestionModal(false);
                            fetchQuestionDetail(questionId);
                        }}
                        onCancel={() => {
                            setShowEditQuestionModal(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
