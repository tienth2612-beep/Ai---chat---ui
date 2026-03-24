"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GroupTable } from "@/components/common-questions/group-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { GroupForm } from "@/components/common-questions/group-form";
import { PlusCircle } from "lucide-react";

export default function CommonQuestionsPage() {
    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddSuccess = () => {
        setShowAddModal(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Common Questions
                    </h2>
                    <p className="text-muted-foreground">
                        Manage question groups and their associated questions.
                    </p>
                </div>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Group
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Group</DialogTitle>
                            <DialogDescription>
                                Create a new group to organize your questions.
                            </DialogDescription>
                        </DialogHeader>
                        <GroupForm
                            onSuccess={handleAddSuccess}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <GroupTable />
        </div>
    );
}
