import { Asterisk, Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
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
        <div {...props} className={cn("border border-white w-full rounded-xl overflow-hidden", className)}>
            <div className="flex justify-between items-center mx-8 my-4">
                <p className="text-4xl font-bold">Wallet {index + 1}</p>
            </div>
            <div className="py-4 px-8 gap-y-4 flex flex-col bg-navy-400">
                <KeyDisplay keyType="Public Key" keyVal={publicKey} />
                <KeyDisplay 
                    keyType="Private Key" 
                    isPrivate={true} 
                    fetchKey={getPrivateKey} 
                />
                <div className="flex items-center text-gray-900 gap-1">
                    <Asterisk size={14} />
                    <p className="text-sm">Click on key to copy</p>
                </div>
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

    const copyToClipboard = () => {
        if (!visible ) return; // Prevent copying masked text
        navigator.clipboard.writeText(currentKey);
    };

    return (
        <div className="w-full">
            <p className="font-medium text-xl text-biege hover:cursor-default">{keyType}</p>
            <div className="flex justify-between items-center w-full gap-2 mt-1">
                <input
                    type={visible ? "text" : "password"}
                    value={visible ? currentKey : "••••••••••••••••••••••••••••••••"}
                    readOnly
                    onClick={copyToClipboard}
                    className={cn(
                        "bg-transparent text-gray-900 transition-colors hover:cursor-pointer hover:text-white",
                        "w-full border-none outline-none rounded-md focus:text-white font-mono text-sm truncate",
                        !visible && "tracking-widest"
                    )}
                />
                {isPrivate && (
                    <ConfirmDialog
                    title="Reveal Private Key?"
                    description="WARNING: This key provides full control over your funds associated with that key. Ensure nobody is watching your screen and you are not sharing your window before proceeding."
                    onConfirm={toggleVisibility}
                    trigger={
                        <Button 
                            className="hover:bg-navy-900" 
                            variant="icon" 
                            size="icon" 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : visible ? (
                                <Eye size={16} />
                            ) : (
                                <EyeOff size={16} />
                            )}
                        </Button>
                    }
                    allowOutsideClick
                    />
                )}
            </div>
        </div>
    );
};