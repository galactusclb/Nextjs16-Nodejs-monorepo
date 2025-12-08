export default function Loading() {
    return (
        <div className="px-6 pb-4">
            <div className="mb-6 h-10 bg-muted rounded animate-pulse" />
            <div className="max-w-2xl space-y-6">
                <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                        <div className="h-24 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                        <div className="h-32 bg-muted rounded animate-pulse" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-11 bg-muted rounded w-24 animate-pulse" />
                    <div className="h-11 bg-muted rounded w-24 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
