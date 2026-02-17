import { createContext, useContext, useEffect, useState } from "react";
import type { CipherData, Wallet, PathPrefix } from "../lib/types";

type WalletState = {
    recoveryPhrase: CipherData;
    test: CipherData;
    salt: string;
    chain: {
        [K in PathPrefix]: Wallet[];
    };
};

const defaultState: WalletState = {
    recoveryPhrase: { encIV: '', cipherEncString: '' },
    test: { encIV: '', cipherEncString: '' },
    salt: '',
    chain: {
        "m/44'/501'": [],
        "m/44'/60'": []
    }
};

type WalletContextType = WalletState & {
    isLoading: boolean;
    isInitialized: boolean;
    sync: (newState: Partial<WalletState>) => void;
    addWallet: (pathPrefix: PathPrefix, wallet: Wallet) => void;
    clearWallets: (pathPrefix: PathPrefix) => void;
    resetWalletStore: (test: CipherData, recoveryPhrase: CipherData, salt: string) => void;
    addTestToStore: (test: CipherData) => void;
    addRecoveryPhraseToStore: (recoveryPhrase: CipherData) => void;
    addSaltToStore: (salt: string) => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<WalletState>(defaultState);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Load
    useEffect(() => {
        const load = () => {
            try {
                const stored = localStorage.getItem('walletStore');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setState(parsed);
                    setIsInitialized(true);
                }
            } catch (e) {
                console.error("Failed to load wallet store", e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const syncToStorage = (newState: WalletState) => {
        localStorage.setItem('walletStore', JSON.stringify(newState));
    };

    const sync = (updates: Partial<WalletState>) => {
        setState(prev => {
            const next = { ...prev, ...updates };
            syncToStorage(next);
            return next;
        });
    };

    const addWallet = (pathPrefix: PathPrefix, wallet: Wallet) => {
        setState(prev => {
            const next = {
                ...prev,
                chain: {
                    ...prev.chain,
                    [pathPrefix]: [...(prev.chain[pathPrefix] || []), wallet]
                }
            };
            syncToStorage(next);
            return next;
        });
    };

    const clearWallets = (pathPrefix: PathPrefix) => {
        setState(prev=>{
            const next = {
                ...prev,
                chain: {
                    ...prev.chain,
                    [pathPrefix]: []
                }
            }
            syncToStorage(next);
            return next;
        });
    };

    const resetWalletStore = (test: CipherData, recoveryPhrase: CipherData, salt: string) => {
        const newState: WalletState = {
            recoveryPhrase,
            test,
            salt,
            chain: {
                "m/44'/501'": [],
                "m/44'/60'": []
            }
        };
        sync(newState);
        setIsInitialized(true);
    };

    const addTestToStore = (test: CipherData) => {
        sync({ test });
    };

    const addRecoveryPhraseToStore = (recoveryPhrase: CipherData) => {
        sync({ recoveryPhrase });
    };

    const addSaltToStore = (salt: string) => {
        sync({ salt });
    };


    return (
        <WalletContext.Provider value={{
            ...state,
            isLoading,
            isInitialized,
            sync,
            addWallet,
            clearWallets,
            resetWalletStore,
            addTestToStore,
            addRecoveryPhraseToStore,
            addSaltToStore
        }}>
            {children}
        </WalletContext.Provider>
    );
};
