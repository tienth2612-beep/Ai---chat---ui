"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">
                    Something went wrong!
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">
                    We apologize for the inconvenience. Please try again later.
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                    <Button onClick={() => reset()}>Try again</Button>
                    <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/dashboard")}
                    >
                        Return to dashboard
                    </Button>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <div className="mt-8 max-w-lg overflow-auto rounded-md border bg-muted p-4 text-left">
                        <p className="font-mono text-sm text-destructive">
                            {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
