export interface Wallet{
    path: string,
    publicKeyString: string,
    encIV: string, // base 64 encoded IV.
    cipherPrivateKeyBytes?: Uint8Array,
    cipherPrivateKeyString: string,
}