import type { CipherData, DeepReadOnly, Wallet } from "./types";

type InMemoryStorage = {
    seed: CipherData;
    test: CipherData;
    salt: string;
    wallets: Wallet[];
}
const inMemoryStorage: InMemoryStorage = {
    seed: {
        encIV: '',
        cipherEncString: ''
    },
    test: {
        encIV: '',
        cipherEncString: ''
    },
    salt: '', // for password creation
    wallets: [],
}

const sync = ()=>{
    localStorage.setItem('walletStore',JSON.stringify(inMemoryStorage));
    loadStoredWalletDetails();
}

export const clearWallets=()=>{
    inMemoryStorage.wallets = [];
    sync();
}

export const resetWalletStore = (test: CipherData, seed: CipherData, salt: string)=>{
    inMemoryStorage.wallets = [];
    inMemoryStorage.test = test; 
    inMemoryStorage.seed = seed; 
    inMemoryStorage.salt = salt;
    sync();
}

export const loadStoredWalletDetails = ()=>{
    const stringifiedData = localStorage.getItem('walletStore');
    if(!stringifiedData){
        throw new Error("stored wallet details not found, Please Re-Enter the seed words to import the wallet");
    }
    const obj = JSON.parse(stringifiedData) as InMemoryStorage;
    Object.assign(inMemoryStorage,obj);
}

export const addWalletToStore=(wallet: Wallet)=>{
    inMemoryStorage.wallets.push(wallet);
    sync();
}

export const addTestToStore=(test: CipherData)=>{
    inMemoryStorage.test = test;
    sync();
}

export const addSeedToStore = (seed: CipherData)=>{
    inMemoryStorage.seed = seed;
    sync();
}

export const addSaltToStore = (salt: string)=>{
    inMemoryStorage.salt = salt;
    sync();
}

export const WalletStore: DeepReadOnly<InMemoryStorage> = inMemoryStorage;