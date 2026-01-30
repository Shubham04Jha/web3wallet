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

export const loadStoredWalletDetails = ()=>{
    const stringifiedData = localStorage.getItem('wallet');
    if(!stringifiedData){
        throw new Error("stored wallet details not found, Please Re-Enter the seed words to import the wallet");
    }
    const obj = JSON.parse(stringifiedData) as InMemoryStorage;
    Object.assign(inMemoryStorage,obj);
    const {test, salt} = inMemoryStorage;
    localStorage.setItem('salt',salt);
    localStorage.setItem('testIv',test.encIV);
    localStorage.setItem('testCipher',test.cipherEncString);
}

export const addWalletToStore=(wallet: Wallet)=>{
    inMemoryStorage.wallets.push(wallet);
    localStorage.setItem('wallet',JSON.stringify(inMemoryStorage));
}

export const addTestToStore=(test: CipherData)=>{
    inMemoryStorage.test = test;
    localStorage.setItem('wallet',JSON.stringify(inMemoryStorage));
}

export const addSeedToStore = (seed: CipherData)=>{
    inMemoryStorage.seed = seed;
    localStorage.setItem('wallet',JSON.stringify(inMemoryStorage));
}

export const addSaltToStore = (salt: string)=>{
    inMemoryStorage.salt = salt;
    localStorage.setItem('wallet',JSON.stringify(inMemoryStorage));
}

export const WalletStore: DeepReadOnly<InMemoryStorage> = inMemoryStorage;