import { createContext, useContext, useEffect, useState } from "react";
import type { CipherData, Wallet } from "../lib/types";

type WalletState = {
    seed: CipherData;
    test: CipherData;
    salt: string;
    wallets: Wallet[];
};

type WalletContextType = WalletState & {
    isLoading: boolean;
    isInitialized: boolean;
    sync: (newState: Partial<WalletState>) => void;
    addWallet: (wallet: Wallet) => void;
    clearWallets: () => void;
    resetWalletStore: (test: CipherData, seed: CipherData, salt: string) => void;
    addTestToStore: (test: CipherData) => void;
    addSeedToStore: (seed: CipherData) => void;
    addSaltToStore: (salt: string) => void;
};

const defaultState: WalletState = {
    seed: { encIV: '', cipherEncString: '' },
    test: { encIV: '', cipherEncString: '' },
    salt: '',
    wallets: [],
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

    const addWallet = (wallet: Wallet) => {
        setState(prev => {
            const next = { ...prev, wallets: [...prev.wallets, wallet] };
            syncToStorage(next);
            return next;
        });
    };

    const clearWallets = () => {
        sync({ wallets: [] });
    };

    const resetWalletStore = (test: CipherData, seed: CipherData, salt: string) => {
        const newState = {
            seed,
            test,
            salt,
            wallets: []
        };
        sync(newState);
        setIsInitialized(true);
    };

    const addTestToStore = (test: CipherData) => {
        sync({ test });
    };

    const addSeedToStore = (seed: CipherData) => {
        sync({ seed });
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
            addSeedToStore,
            addSaltToStore
        }}>
            {children}
        </WalletContext.Provider>
    );
};
