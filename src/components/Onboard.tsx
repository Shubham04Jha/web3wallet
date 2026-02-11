import { Tabs } from "radix-ui"
import { useEffect, useRef, useState} from "react";
import { Button } from "./ui/Button";
import { resetWallet } from "../hooks/useCrypto";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye, Copy } from "lucide-react";
import { getNewSeedPhrase, isValidSeedPhrase } from "../lib/walletGen";
import { copyToClipBoard } from "../lib/utils";
import { ConfirmDialog } from "./ui/ConfirmDialog";

export const Onboard = () => {
    const [step, setStep] = useState<string>('1');
    const passwordRef = useRef<string>('');
    const navigate = useNavigate();

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
        <div className="flex justify-center w-full mb-8">
            <Tabs.Root value={step} className="w-full max-w-md bg-navy-900 border border-navy-400 rounded-xl p-8 shadow-2xl">
                <Tabs.List className="flex gap-2 mb-8 border-b border-navy-400 pb-2">
                    <Tabs.Trigger 
                        value="1" 
                        disabled={step !== '1'}
                        className="text-teal data-[state=active]:text-biege data-[state=active]:border-b-2 border-biege px-4 py-2 transition-all cursor-default"
                    >
                        1. Password
                    </Tabs.Trigger>
                    <Tabs.Trigger 
                        value="2" 
                        disabled={step !== '2'}
                        className="text-teal data-[state=active]:text-biege data-[state=active]:border-b-2 border-biege px-4 py-2 transition-all cursor-default"
                    >
                        2. Seed Phrase
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="1">
                    <PasswordStep onNext={handlePasswordComplete} password={passwordRef.current}/>
                </Tabs.Content>

                <Tabs.Content value="2">
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
    const [showPassword, setShowPassword] = useState(false);

    const isLengthValid = pwd.length >= 4;
    const isMatching = pwd === confirmPwd && confirmPwd.length > 0;
    const isValid = isLengthValid && isMatching;

    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-2">
                <h2 className="text-biege text-2xl font-bold">Set a Password</h2>
                <p className="text-teal text-sm">This password will unlock your wallet on this device only.</p>
            </div>
            
            <div className="space-y-4">
                {/* Primary Password Input */}
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter password (min 4 chars)"
                        className="w-full p-3 pr-10 rounded-md bg-navy-400 text-white border border-transparent focus:border-teal outline-none transition-all"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-teal hover:text-biege transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Confirm password"
                        className={`w-full p-3 rounded-md bg-navy-400 text-white border outline-none transition-all ${
                            confirmPwd.length > 0 && !isMatching ? 'border-red-500' : 'border-transparent focus:border-teal'
                        }`}
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                    />
                </div>
                
                {confirmPwd.length > 0 && !isMatching && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
            </div>

            <Button 
                disabled={!isValid} 
                onClick={() => onNext(pwd)} 
                className="w-full"
                size="lg"
            >
                Continue to Seed
            </Button>
        </div>
    );
};


const SeedStep = ({ onBack, onComplete }: { onBack: () => void, onComplete: (seed: string) => void }) => {
    const [seed, setSeed] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isValid,setIsValid] = useState<boolean>(isValidSeedPhrase(seed));
    useEffect(()=>{
        setIsValid(isValidSeedPhrase(seed));
    },[seed])
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
            <div className="space-y-2">
                <h2 className="text-biege text-2xl font-bold">Secret Recovery Phrase</h2>
                <p className="text-teal text-sm">Save these words securely. They are the only way to recover your wallet.</p>
            </div>

            <div className="relative">
                <textarea 
                    placeholder="Paste your seed phrase here or generate a new one..."
                    className="w-full h-32 p-4 pr-12 rounded-md bg-navy-400 text-white border border-transparent focus:border-teal outline-none resize-none leading-relaxed font-mono"
                    value={isVisible ? seed : getMaskedSeed()}
                    readOnly={!isVisible && seed.length > 0}
                    onChange={(e) => {
                        // Only update state if visible (prevents corrupting seed with dots)
                        if (isVisible ) {
                            setSeed(e.target.value);
                        }
                    }}
                />
                {seed && (
                    <div className="absolute right-1 top-0">
                        {!isVisible ? (
                            <ConfirmDialog
                                title="Reveal Secret Phrase?"
                                description="Make sure nobody is looking at your screen. These words provide full access to your wallet."
                                onConfirm={() => setIsVisible(true)}
                                trigger={
                                    <Button 
                                        type="button"
                                        variant="icon"
                                        size="icon"
                                        title={isVisible ? "Hide Seed" : "Show Seed"}
                                        className="text-teal hover:text-biege"
                                    >
                                        <Eye size={20} />
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
                                title={isVisible ? "Hide Seed" : "Show Seed"}
                                className="text-teal hover:text-biege"
                            >
                                <EyeOff size={20} />
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
                                className="text-teal hover:text-biege"
                            >
                                <Copy size={20} />
                            </Button>
                        )}
                    </div>
                )}
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