import { base64ToBytes, bytesToBase64 } from "./encodeDecode";

let cryptoKey: CryptoKey|null  = null;
let IV: null|Uint8Array = null;
export const generateCryptoKeyFromPassword = async (password: string)=>{
    const passwordAsBytes = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey(
        'raw',
        passwordAsBytes,
        'PBKDF2',
        false,
        ['deriveKey']
    );
    const salt = crypto.getRandomValues(new Uint8Array(16));
    cryptoKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        {name: 'AES-GCM', length: 128},
        false,
        ['encrypt', 'decrypt']
    );
    const base64IV = localStorage.getItem('IV')!;
    const testCipher = localStorage.getItem('testCipher')!;
    IV = base64ToBytes(base64IV);
    const testRes = await decrypt(base64ToBytes(testCipher)); // will throw error if password is wrong, or localStorage was tempered with or the contents were not loaded on to the localStorage yet.
    console.log(testRes); // if this is reached password is set, IV is loaded adn we are good to go.
}

const encrypt = async(plainBuffer: Uint8Array)=>{
    if (!cryptoKey || !IV) {
        throw new Error('CryptoKey or IV is not initialized');
    }
    return await crypto.subtle.encrypt(
        {name:'AES-GCM',iv: IV as BufferSource},
        cryptoKey,
        plainBuffer as BufferSource
    );
}

const decrypt = async(encryptedBuffer: Uint8Array)=>{
    if (!cryptoKey || !IV) {
        throw new Error('CryptoKey or IV is not initialized');
    }
    return await crypto.subtle.decrypt(
        {name: 'AES-GCM', iv: IV as BufferSource },
        cryptoKey,
        encryptedBuffer as BufferSource
    );
}

export const decryptData = async(base64EncodedString: string)=>{
    let bytes: Uint8Array|null = null;
    try {
        const rawBuffer = await decrypt(base64ToBytes(base64EncodedString)); // bytes that was received 
        bytes = new Uint8Array(rawBuffer);
        return new TextDecoder().decode(bytes); // returns the initial string representation.
    } catch (error) {
        return null;
    }finally{
        if(bytes) bytes.fill(0); //override that memory
    }
}

export const encryptData = async(plainText: string)=>{
    try {
        const plainBytes = new TextEncoder().encode(plainText);
        const bytes = await encrypt(plainBytes);
        return bytesToBase64(new Uint8Array(bytes));
    } catch (error) {
        return null;
    }
}