import { useEffect, useState } from "react";
import { decryptData, generateCryptoKeyFromPassword } from "../lib/cryptography";
import { loadStoredWalletDetails } from "../lib/store";
import type { Wallet } from "../lib/types";

const globalKeyStore: Wallet[] = []

let cipherSeedWords: string|null = null; // base64 encoded cipherSeedWords
let SEEDIV: string|null = null;

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
        if(!cipherSeedWords||!SEEDIV) return '';
        return await decryptData(cipherSeedWords, SEEDIV);
    }
    const showPrivateKeyFromIdx = async(idx: number)=>{
        if(idx<0||idx>=globalKeyStore.length){
            throw new Error(idx+' is not a valid index for the '+(globalKeyStore.length+1)+' sized wallet array');
        }
        const wallet = globalKeyStore[idx];
        const cipheredBase64Key = wallet.cipherPrivateKeyString;
        const encIv = wallet.encIV;
        return await decryptData(cipheredBase64Key, encIv);
    }
    useEffect(()=>{
        (async()=>{
            try {
                setIsLoading(true)
                const {seedWords, wallets, seedIv} = await loadStoredWalletDetails();
                SEEDIV = seedIv;
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