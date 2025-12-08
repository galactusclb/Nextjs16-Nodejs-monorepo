'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    return (
        <div className="px-6 pb-4">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div>

            <div className="max-w-2xl">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="space-y-3 flex-1">
                            <h2 className="text-lg font-semibold text-destructive">
                                Error Loading Order
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {error.message || 'Failed to load order details. Please try again.'}
                            </p>
                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => reset()}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.back()}
                                >
                                    Go Back
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
