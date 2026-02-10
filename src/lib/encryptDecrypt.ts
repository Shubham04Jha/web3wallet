import { base64ToBytes, bytesToBase64 } from "./encodeDecode";
import type { CipherData } from "./types";

let cryptoKey: CryptoKey | null = null;

const PBKDF2_CONFIG = { name: 'PBKDF2', iterations: 1000000, hash: 'SHA-256' };
const AES_CONFIG = { name: 'AES-GCM', length: 128 };

const getDerivedKey = async (password: string, saltBytes: Uint8Array) => {
    const baseKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        { ...PBKDF2_CONFIG, salt: saltBytes as BufferSource },
        baseKey,
        AES_CONFIG,
        false,
        ['encrypt', 'decrypt']
    );
};


export const generateCryptoKeyFromPassword = async (password: string, b64EncSalt: string, test: CipherData) => {
    const salt = base64ToBytes(b64EncSalt);
    cryptoKey = await getDerivedKey(password, salt);

    const IV = base64ToBytes(test.encIV);
    
    const testRes = await decrypt(base64ToBytes(test.cipherEncString), IV); // will throw error if password is wrong, or localStorage was tempered with or the contents were not loaded on to the localStorage yet.
    console.log(new TextDecoder().decode(testRes)); // if this is reached password is set, testCipherData is loaded and we are good to go.
};

export const resetPassword = async (password: string) => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    cryptoKey = await getDerivedKey(password, salt);
    return bytesToBase64(salt);
};

export const encryptData = async (plainText: string) => {
    try {
        const { bytes, iv } = await encrypt(new TextEncoder().encode(plainText));
        return {
            cipherEncString: bytesToBase64(new Uint8Array(bytes)),
            encIV: bytesToBase64(new Uint8Array(iv))
        };
    } catch (error) {
        return null;
    }
};

export const decryptData = async (cipherData: CipherData) => {
    let bytes: Uint8Array | null = null;
    try {
        const rawBuffer = await decrypt(
            base64ToBytes(cipherData.cipherEncString),
            base64ToBytes(cipherData.encIV)
        ); // bytes that was received 
        bytes = new Uint8Array(rawBuffer);
        return new TextDecoder().decode(bytes); // returns the initial string representation.
    } catch (error) {
        return null;
    } finally {
        if (bytes) bytes.fill(0); //override that memory
    }
};

const encrypt = async (plainBuffer: Uint8Array) => {
    if (!cryptoKey) throw new Error('CryptoKey is not initialized');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const bytes = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv as BufferSource },
        cryptoKey,
        plainBuffer as BufferSource
    );
    return { bytes, iv };
};

const decrypt = async (encryptedBuffer: Uint8Array, IV: Uint8Array) => {
    if (!cryptoKey) throw new Error('CryptoKey is not initialized');
    return await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: IV as BufferSource },
        cryptoKey,
        encryptedBuffer as BufferSource
    );
};