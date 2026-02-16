import { Asterisk, Eye, EyeOff } from "lucide-react";
import { cn, copyToClipBoard } from "../../lib/utils";
import { Button } from "./Button";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

interface WalletContainerInterface extends React.HTMLAttributes<HTMLDivElement> {
    publicKey: string;
    getPrivateKey: () => Promise<string | null>;
    index: number;
}

export const WalletContainer = ({ className, publicKey, getPrivateKey, index, ...props }: WalletContainerInterface) => {
    return (
        <div {...props} className={cn("border border-border-card w-full rounded-2xl overflow-hidden hover:border-text-accent/30 transition-all duration-300 shadow-lg", className)}>
            <div className="flex justify-between items-center mx-8 my-6">
                <p className="text-3xl font-bold text-text-primary tracking-tight">Wallet {index + 1}</p>
                <div className="px-3 py-1 rounded-full bg-text-accent/10 border border-text-accent/20 text-text-accent text-xs font-mono">
                    SOLANA
                </div>
            </div>
            <div className="py-6 px-8 gap-y-6 flex flex-col bg-bg-tertiary/30 backdrop-blur-sm">
                <KeyDisplay keyType="Public Key" keyVal={publicKey} />
                <div className="h-px w-full bg-border-card" />
                <KeyDisplay
                    keyType="Private Key"
                    isPrivate={true}
                    fetchKey={getPrivateKey}
                />
            </div>
            <div className="bg-bg-primary/50 py-2 px-8 flex items-center gap-2 text-text-secondary border-t border-border-card">
                <Asterisk size={12} className="opacity-50" />
                <p className="text-xs font-medium opacity-50">Click on any key to copy it to clipboard</p>
            </div>
        </div>
    );
};

interface KeyDisplayProps {
    keyType: string;
    keyVal?: string; // For public keys
    isPrivate?: boolean;
    fetchKey?: () => Promise<string | null>; // For private keys
}

const KeyDisplay = ({ keyVal: initialKeyVal, keyType, isPrivate = false, fetchKey }: KeyDisplayProps) => {
    const [visible, setVisible] = useState<boolean>(!isPrivate);
    const [currentKey, setCurrentKey] = useState<string>(initialKeyVal || "");
    const [loading, setLoading] = useState(false);

    const toggleVisibility = async () => {
        if (!visible && isPrivate && fetchKey && !currentKey) {
            setLoading(true);
            const decrypted = await fetchKey();
            if (decrypted) setCurrentKey(decrypted);
            setLoading(false);
        }
        setVisible(!visible);
    };

    const onCopy = () => {
        if (!visible) return; // Prevent copying masked text
        copyToClipBoard(currentKey);
    };

    return (
        <div className="w-full group">
            <p className="font-medium text-sm text-text-secondary uppercase tracking-wider mb-2">{keyType}</p>
            <div className="flex justify-between items-center w-full gap-4">
                <div
                    onClick={onCopy}
                    className="relative grow cursor-pointer group/input"
                >
                    <input
                        type={visible ? "text" : "password"}
                        value={visible ? currentKey : "••••••••••••••••••••••••••••••••"}
                        readOnly
                        className={cn(
                            "w-full bg-bg-primary/50 text-text-primary border border-border-card rounded-lg p-3 font-mono text-sm truncate transition-all",
                            "group-hover/input:border-text-accent/50 group-hover/input:bg-bg-primary/80 outline-none",
                            !visible && "tracking-[0.2em] text-text-secondary"
                        )}
                    />
                </div>

                {isPrivate && (
                    visible ? <Button
                        className="hover:bg-white/10 text-text-secondary hover:text-text-primary"
                        variant="icon"
                        size="icon"
                        onClick={toggleVisibility}
                        disabled={loading}>
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-text-accent" />
                        ) :
                            <Eye size={18} />
                        }
                    </Button> :
                        <ConfirmDialog
                            title="Reveal Private Key?"
                            description="WARNING: This key provides full control over your funds associated with that key. Ensure nobody is watching your screen and you are not sharing your window before proceeding."
                            onConfirm={toggleVisibility}
                            trigger={
                                <Button
                                    className="hover:bg-white/10 text-text-secondary hover:text-text-primary"
                                    variant="icon"
                                    size="icon"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-text-accent" />
                                    ) :
                                        <EyeOff size={18} />
                                    }
                                </Button>
                            }
                            allowOutsideClick
                        />
                )}
            </div>
        </div>
    );
};