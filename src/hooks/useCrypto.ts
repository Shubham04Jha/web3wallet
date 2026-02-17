import { useState } from "react";
import { decryptData, encryptData, generateCryptoKeyFromPassword, resetPassword } from "../lib/encryptDecrypt";
import { useWallet } from "../context/WalletContext";
import type { PathPrefix, Wallet } from "../lib/types";
import { toast } from "react-toastify";

export const useCrypto = () => {
    const {
        recoveryPhrase,
        salt,
        test,
        resetWalletStore,
        addRecoveryPhraseToStore: addRecoveryPhraseToStoreCtx,
    } = useWallet();

    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const showRecoveryPhrase = async () => {
        return await decryptData(recoveryPhrase);
    };

    const resetWallet = async (plainRecoveryPhrase: string, password: string) => {
        const saltB64Enc = await resetPassword(password);
        const testString = 'Tested CryptoKey successfully';
        const testData = await encryptData(testString);
        if (!testData) {
            throw new Error('error in encrypting testString');
        }
        const recoveryPhraseData = await encryptData(plainRecoveryPhrase);
        if (!recoveryPhraseData) {
            throw new Error('error in encrypting recovery phrase');
        }
        resetWalletStore(testData, recoveryPhraseData, saltB64Enc);
    };

    const encryptAndStoreRecoveryPhrase = async (plainRecoveryPhrase: string) => {
        const res = await encryptData(plainRecoveryPhrase);
        if (!res) {
            throw new Error('Something went wrong while encrypting recovery phrase');
        }
        addRecoveryPhraseToStoreCtx(res);
    };

    const inputPassword = async (password: string) => {
        try {
            setIsLoading(true);
            await generateCryptoKeyFromPassword(password, salt, test);
            setIsLogin(true);
            setError(null);
        } catch (error) {
            setIsLogin(false);
            console.log('An error occured could be due to wrong password, Please Re-enter your password');
            toast.error('An error occured could be due to wrong password, Please Re-enter your password', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setError('Wrong Password');
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        isLogin,
        inputPassword,
        error,
        showRecoveryPhrase,
        resetWallet,
        encryptAndStoreRecoveryPhrase,
    }
}

export const useCryptoChain = (pathPrefix: PathPrefix)=>{
    const {
        chain,
        addWallet: addWalletCtx,
        clearWallets: clearWalletsCtx
    } = useWallet();
    const wallets = chain[pathPrefix];
    const showPrivateKeyFromIdx = async (idx: number) => {
        if (idx < 0 || idx >= wallets.length) {
            throw new Error(idx + ' is not a valid index for the ' + (wallets.length + 1) + ' sized wallet array');
        }
        const wallet = wallets[idx];
        const cipheredBase64Key = wallet.cipherPrivateKeyString;
        const encIV = wallet.encIV;
        return await decryptData({ cipherEncString: cipheredBase64Key, encIV });
    };

    
    const encryptAndStoreWallet = async (path: string, publicKey: string, privateKey: string) => {
        const res = await encryptData(privateKey);
        if (!res) {
            throw new Error('Something went wrong while encrypting wallet details');
        }
        const wallet: Wallet = {
            path,
            publicKeyString: publicKey,
            cipherPrivateKeyString: res.cipherEncString,
            encIV: res.encIV
        }
        addWalletCtx(pathPrefix, wallet);
    };

    const clearWallets = () => {
        clearWalletsCtx(pathPrefix);
    };
    return{
        showPrivateKeyFromIdx,
        encryptAndStoreWallet,
        clearWallets
    }
}