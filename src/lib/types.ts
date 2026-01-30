export interface Wallet{
    path: string,
    publicKeyString: string,
    cipherPrivateKeyString: string,
    encIV: string, // base 64 encoded IV.
    cipherPrivateKeyBytes?: Uint8Array,
}

export interface CipherData{
    cipherEncString: string,
    encIV: string
}

export type DeepReadOnly<T>= 
                            T extends (...args: any)=>any?T:
                            T extends object? { readonly [k in keyof T] : DeepReadOnly<T[k]>}: T