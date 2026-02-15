import { Tabs } from "radix-ui"
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/Button";
import { useCrypto } from "../hooks/useCrypto";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye, Copy } from "lucide-react";
import { getNewSeedPhrase, isValidSeedPhrase } from "../lib/walletGen";
import { cn, copyToClipBoard } from "../lib/utils";
import { ConfirmDialog } from "./ui/ConfirmDialog";

export const Onboard = () => {
    const [step, setStep] = useState<string>('1');
    const passwordRef = useRef<string>('');
    const navigate = useNavigate();
    const { resetWallet } = useCrypto();

    const handlePasswordComplete = (pwd: string) => {
        passwordRef.current = pwd;
        setStep('2');
    };

    const handleOnboardingComplete = async (seed: string) => {
        try {
            await resetWallet(seed, passwordRef.current);
            navigate('/wallet');
        } catch (error) {
            console.error("Failed to initialize wallet", error);
        }
    };

    return (
        <div className="flex justify-center w-full mb-8 animate-[slide-up_0.5s_ease-out]">
            <Tabs.Root value={step} className="w-full max-w-lg glass-panel rounded-2xl p-8">
                <Tabs.List className="flex gap-2 justify-around mb-8 border-b border-border-card pb-2">
                    <Tabs.Trigger
                        value="1"
                        disabled={step !== '1'}
                        className="text-text-secondary font-medium data-[state=active]:text-text-accent data-[state=active]:border-b-2 border-text-accent px-4 py-2 transition-all cursor-default"
                    >
                        1. Password
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="2"
                        disabled={step !== '2'}
                        className="text-text-secondary font-medium data-[state=active]:text-text-accent data-[state=active]:border-b-2 border-text-accent px-4 py-2 transition-all cursor-default"
                    >
                        2. Seed Phrase
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="1" className="outline-none">
                    <PasswordStep onNext={handlePasswordComplete} password={passwordRef.current} />
                </Tabs.Content>

                <Tabs.Content value="2" className="outline-none">
                    <SeedStep
                        onBack={() => setStep('1')}
                        onComplete={handleOnboardingComplete}
                    />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};

const PasswordStep = ({ onNext, password }: { onNext: (pwd: string) => void, password: string }) => {
    const [pwd, setPwd] = useState(password);
    const [confirmPwd, setConfirmPwd] = useState(password);

    const isLengthValid = pwd.length >= 4;
    const isMatching = pwd === confirmPwd && confirmPwd.length > 0;
    const isValid = isLengthValid && isMatching;

    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-2 text-center">
                <h2 className="text-text-primary text-2xl font-bold">Set a Password</h2>
                <p className="text-text-secondary text-sm">This password will unlock your wallet on this device only.</p>
            </div>

            <div className="space-y-4">
                {/* Primary Password Input */}
                <div className="relative">
                    <input
                        type="password"
                        placeholder="Enter password (min 4 chars)"
                        className="w-full p-4 pr-10 rounded-xl bg-bg-primary/50 text-text-primary border border-border-card focus:border-text-accent focus:ring-1 focus:ring-text-accent outline-none transition-all placeholder:text-text-secondary/50"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                    />
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                    <input
                        type="password"
                        placeholder="Confirm password"
                        className={`w-full p-4 rounded-xl bg-bg-primary/50 text-text-primary border outline-none transition-all placeholder:text-text-secondary/50 ${confirmPwd.length > 0 && !isMatching ? 'border-error ring-1 ring-error' : 'border-border-card focus:border-text-accent focus:ring-1 focus:ring-text-accent'
                            }`}
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                    />
                </div>

                {confirmPwd.length > 0 && !isMatching && (
                    <p className="text-error text-xs mt-1 ml-1">Passwords do not match</p>
                )}
            </div>

            <Button
                disabled={!isValid}
                onClick={() => onNext(pwd)}
                className="w-full mt-2"
                size="lg"
            >
                Continue
            </Button>
        </div>
    );
};


const SeedStep = ({ onBack, onComplete }: { onBack: () => void, onComplete: (seed: string) => void }) => {
    const [seed, setSeed] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isValid, setIsValid] = useState<boolean>(isValidSeedPhrase(seed));
    useEffect(() => {
        setIsValid(isValidSeedPhrase(seed));
    }, [seed])
    const handleGenerate = () => {
        const mnemonic = getNewSeedPhrase();
        setSeed(mnemonic);
    };
    const getMaskedSeed = () => {
        if (!seed) return "";
        return seed
            .split(/\s+/) // seperate by space
            .map(word => "•".repeat(word.length)) // "••••" per word
            .join(" ");
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-2 text-center">
                <h2 className="text-text-primary text-2xl font-bold">Secret Recovery Phrase</h2>
                <p className="text-text-secondary text-sm">Save these words securely. They are the only way to recover your wallet.</p>
            </div>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-text-accent to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative">
                    {/* REAL INPUT (receives typing) */}
                    <textarea
                        placeholder="Paste your seed phrase here or generate a new one..."
                        className={cn(
                            "absolute inset-0 caret-text-accent focus:border-text-accent outline-none bg-transparent text-transparent z-10",
                            "w-full h-48 p-4 pr-12 rounded-xl resize-none leading-relaxed font-mono select-none selection:bg-transparent"
                        )}
                        maxLength={200}
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />

                    {/* DISPLAY LAYER */}
                    <textarea
                        value={isVisible ? seed : getMaskedSeed()}
                        readOnly
                        className={cn(
                            "bg-bg-primary/80 text-text-primary pointer-events-none",
                            "w-full h-48 p-4 pr-12 rounded-xl border border-border-card resize-none leading-relaxed font-mono select-none selection:bg-transparent"
                        )}
                    />
                    {seed && (
                        <div className="absolute right-2 top-2 z-20 flex flex-col gap-1">
                            {!isVisible ? (
                                <ConfirmDialog
                                    title="Reveal Secret Phrase?"
                                    description="Make sure nobody is looking at your screen. These words provide full access to your wallet."
                                    onConfirm={() => {
                                        setIsVisible(true)
                                    }}
                                    trigger={
                                        <Button
                                            type="button"
                                            variant="icon"
                                            size="icon"
                                            title="Show Seed"
                                            className="text-text-secondary hover:text-text-primary"
                                        >
                                            <Eye size={18} />
                                        </Button>
                                    }
                                    allowOutsideClick
                                />
                            ) : (
                                <Button
                                    type="button"
                                    variant="icon"
                                    size="icon"
                                    onClick={() => setIsVisible(!isVisible)}
                                    title="Hide Seed"
                                    className="text-text-secondary hover:text-text-primary"
                                >
                                    <EyeOff size={18} />
                                </Button>
                            )}
                            {isValid && (
                                <Button
                                    type="button"
                                    variant="icon"
                                    size="icon"
                                    onClick={() => {
                                        copyToClipBoard(seed);
                                    }}
                                    title="Copy to Clipboard"
                                    className="text-text-secondary hover:text-text-primary"
                                >
                                    <Copy size={18} />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" onClick={handleGenerate}>
                    Generate New
                </Button>
                <Button variant="secondary" onClick={onBack}>
                    Go Back
                </Button>
            </div>

            <Button
                disabled={!isValid}
                onClick={() => onComplete(seed)}
                size="lg"
                className="w-full"
            >
                Complete Setup
            </Button>
        </div>
    );
};