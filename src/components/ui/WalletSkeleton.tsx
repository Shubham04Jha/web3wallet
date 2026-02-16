import { cn } from "../../lib/utils";

const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("bg-bg-secondary/40 rounded-lg overflow-hidden relative", className)}>
        <div className="absolute inset-0 animate-shimmer" />
    </div>
);

export const WalletSkeleton = () => {
    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
            {/* Mnemonics Accordion Skeleton */}
            <div className="rounded-xl w-full border border-border-card bg-bg-secondary/20 overflow-hidden">
                <div className="flex justify-between items-center py-6 px-8">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                </div>
            </div>

            {/* Wallets Header Skeleton */}
            <div className="flex justify-between items-end mt-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-11 w-36 rounded-xl" />
                    <Skeleton className="h-11 w-36 rounded-xl" />
                </div>
            </div>

            {/* Wallet Card Skeleton - Detailed */}
            <div className="border border-border-card rounded-2xl overflow-hidden bg-bg-secondary/10 shadow-lg">
                {/* Card Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-border-card/50">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-40" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Card Content */}
                <div className="p-8 space-y-8 bg-bg-tertiary/10 backdrop-blur-sm">
                    {/* Public Key section */}
                    <div className="space-y-4">
                        <div className="space-y-1.5 px-1">
                            <Skeleton className="h-3 w-16 opacity-40" />
                            <Skeleton className="h-4 w-28 opacity-60" />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative grow">
                                <Skeleton className="h-12 w-full rounded-xl border border-border-card" />
                                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex gap-1">
                                    <Skeleton className="h-2 w-full max-w-[80%] opacity-20" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider line placeholder */}
                    <div className="h-px w-full bg-border-card/50" />

                    {/* Private Key section */}
                    <div className="space-y-4">
                        <div className="space-y-1.5 px-1">
                            <Skeleton className="h-3 w-16 opacity-40" />
                            <Skeleton className="h-4 w-28 opacity-60" />
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="relative grow">
                                <Skeleton className="h-12 w-full rounded-xl border border-border-card" />
                                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex gap-1.5">
                                    {[...Array(12)].map((_, i) => (
                                        <Skeleton key={i} className="h-1.5 w-1.5 rounded-full opacity-20" />
                                    ))}
                                </div>
                            </div>
                            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="bg-bg-primary/30 py-4 px-8 flex items-center gap-3 border-t border-border-card/50">
                    <Skeleton className="h-3 w-3 rounded-full opacity-30" />
                    <Skeleton className="h-3 w-64 opacity-30" />
                </div>
            </div>

            {/* Hint of second card */}
            <div className="border border-border-card rounded-2xl overflow-hidden bg-bg-secondary/10 opacity-30">
                <div className="h-20 px-8 flex items-center">
                    <Skeleton className="h-7 w-32" />
                </div>
            </div>
        </div>
    );
};
