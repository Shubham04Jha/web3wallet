export const WalletSkeleton = () => {
    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto animate-pulse">
            {/* Secret Mnemonics Skeleton */}
            <div className="bg-navy-800/40 border border-navy-700/50 rounded-xl h-36 w-full" />

            {/* Wallets Header Skeleton */}
            <div className="flex justify-between items-center mt-4">
                <div className="h-8 w-40 bg-navy-800 rounded-lg" />
                <div className="flex gap-3">
                    <div className="h-10 w-32 bg-navy-800 rounded-lg" />
                    <div className="h-10 w-32 bg-navy-800 rounded-lg" />
                </div>
            </div>

            {/* Wallet Card Skeleton */}
            <div className="border border-navy-700/50 rounded-2xl overflow-hidden bg-navy-900/20">
                <div className="h-16 px-8 flex items-center bg-navy-800/40 border-b border-navy-700/50">
                    <div className="h-6 w-24 bg-navy-700/50 rounded-md" />
                </div>
                <div className="p-8 space-y-8">
                    <div className="space-y-3">
                        <div className="h-4 w-20 bg-navy-700/50 rounded" />
                        <div className="h-12 w-full bg-navy-800/60 rounded-xl border border-navy-700/30" />
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 w-20 bg-navy-700/50 rounded" />
                        <div className="h-12 w-full bg-navy-800/60 rounded-xl border border-navy-700/30" />
                    </div>
                </div>
            </div>
        </div>
    );
};
