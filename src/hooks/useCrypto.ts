import { useEffect, useState } from "react";
import { decryptData, encryptData, generateCryptoKeyFromPassword, resetPassword } from "../lib/encryptDecrypt";
import { addSeedToStore, addWalletToStore, loadStoredWalletDetails, resetWalletStore, WalletStore } from "../lib/store";
import type { Wallet } from "../lib/types";

const showSeedWords = async ()=>{
    return await decryptData(WalletStore.seed);
}

const showPrivateKeyFromIdx = async(idx: number)=>{
    const wallets = WalletStore.wallets;
    if(idx<0||idx>=wallets.length){
        throw new Error(idx+' is not a valid index for the '+(wallets.length+1)+' sized wallet array');
    }
    const wallet = wallets[idx];
    const cipheredBase64Key = wallet.cipherPrivateKeyString;
    const encIV = wallet.encIV;
    return await decryptData({cipherEncString: cipheredBase64Key, encIV});
}

const resetWallet = async(plainSeed: string, password: string)=>{
    const saltB64Enc = await resetPassword(password);
    const testString = 'Tested CryptoKey successfully';
    const testData = await encryptData(testString);
    if(!testData){
        throw new Error('error in encrypting testString');
    }
    const seedData = await encryptData(plainSeed);
    if(!seedData){
        throw new Error('error in encrypting seedString');
    }
    resetWalletStore(testData, seedData, saltB64Enc);
}

const encryptAndStoreSeed = async (plainSeed: string)=>{
    const res = await encryptData(plainSeed);
    if(!res){
        throw new Error('Something went wrong while encrypting seed string');
    }
    addSeedToStore(res);
}

const encryptAndStoreWallet = async(path: string, publicKey: string, privateKey: string)=>{
    // all the keys in bs58, idea being call this function with the wallet details and after it returns, call the setState in FE.
    const res = await encryptData(privateKey);
    if(!res){
        throw new Error('Something went wrong while encrypting wallet details');
    }
    const wallet: Wallet = {
        path, 
        publicKeyString: publicKey, 
        cipherPrivateKeyString: res.cipherEncString,
        encIV: res.encIV
    }
    addWalletToStore(wallet);
}

export const useCrypto = ()=>{
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputPassword = async (password: string)=>{
        try {
            await generateCryptoKeyFromPassword(password,WalletStore.salt, WalletStore.test);
            setIsLogin(true);
            //cryptoKey is loaded. IV is set-uped.
        } catch (error) {
            setIsLogin(false);
            console.log('An error occured could be due to wrong password, Please Re-enter your password')
        }
    }  
    useEffect(()=>{
        try {
            setIsLoading(true)
            loadStoredWalletDetails();
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
        return ()=>{
            setIsLogin(false);
        }
    },[])
    return{
        isLoading, isLogin, inputPassword
    }
}

export {
    showSeedWords,encryptAndStoreSeed, showPrivateKeyFromIdx,
    encryptAndStoreWallet, resetWallet,
}