export interface Wallet{
    path: string,
    publicKeyString: string,
    cipherPrivateKeyBytes?: Uint8Array,
    cipherPrivateKeyString: string,
}