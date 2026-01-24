import { useEffect, useState } from "react";
import { decryptData, generateCryptoKeyFromPassword } from "../lib/cryptography";
import { loadStoredWalletDetails } from "../lib/store";
import type { Wallet } from "../lib/types";

const globalKeyStore: Wallet[] = []

let cipherSeedWords: string|null = null; // base64 encoded cipherSeedWords

export const useCrypto = ()=>{
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const init = async (password: string)=>{
        try {
            await generateCryptoKeyFromPassword(password);
            //cryptoKey is loaded. IV is set-uped.
        } catch (error) {
            setIsLogin(false);
            console.log('An error occured could be due to wrong password, Please Re-enter your password')
        }
    }
    const showCipherSeedWords = async ()=>{
        if(!cipherSeedWords) return '';
        return await decryptData(cipherSeedWords);
    }
    const showPrivateKeyFromIdx = async(idx: number)=>{
        if(idx<0||idx>=globalKeyStore.length){
            throw new Error(idx+' is not a valid index for the '+(globalKeyStore.length+1)+' sized wallet array');
        }
        const wallet = globalKeyStore[idx];
        const cipheredBase64Key = wallet.cipherPrivateKeyString;
        return await decryptData(cipheredBase64Key);
    }
    useEffect(()=>{
        (async()=>{
            try {
                setIsLoading(true)
                const {seedWords, wallets} = await loadStoredWalletDetails();
                cipherSeedWords = seedWords;
                wallets.forEach((wallet: Wallet) => {
                    globalKeyStore.push(wallet);
                });

            } catch (error) {
                if(error instanceof Error){
                    console.log(error.message);
                }else{
                    console.log('error occurred, please re-enter the seed words');
                }
                setIsLogin(false);
            } finally{
                setIsLoading(false);
            }
        })();
        return ()=>{
            setIsLogin(false);
        }
    },[])
    return{
        isLoading, isLogin, init, showCipherSeedWords, showPrivateKeyFromIdx
    }
}