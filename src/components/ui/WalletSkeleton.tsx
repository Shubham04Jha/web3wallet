export const WalletSkeleton = () => {
    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto animate-pulse">
            {/* Secret Mnemonics Skeleton */}
            <div className="border border-navy-400 rounded-sm h-32 w-full bg-navy-900/50" />

            {/* Wallets Header Skeleton */}
            <div className="flex justify-between items-end mt-4">
                <div className="h-10 w-32 bg-navy-400 rounded-md" />
                <div className="flex gap-4">
                    <div className="h-10 w-28 bg-navy-400 rounded-md" />
                    <div className="h-10 w-28 bg-navy-400 rounded-md" />
                </div>
            </div>

            {/* Wallet Card Skeleton */}
            <div className="border border-navy-400 rounded-xl overflow-hidden">
                <div className="h-16 px-8 flex items-center bg-navy-900">
                    <div className="h-8 w-24 bg-navy-400 rounded-md" />
                </div>
                <div className="p-8 space-y-6 bg-navy-400/50">
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-navy-400 rounded" />
                        <div className="h-4 w-full bg-navy-400 rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-navy-400 rounded" />
                        <div className="h-4 w-full bg-navy-400 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};