import { generateMnemonic,  mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from 'bs58';

export const getNewSeedPhrase = ()=>{
    return generateMnemonic();
}

export const getSolanaWalletByAccount = (mnemonic: string, idx: number)=>{
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${idx}'/0'`;
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const {secretKey, publicKey} = nacl.sign.keyPair.fromSeed(derivedSeed);
    const privateKeyStringB58 = bs58.encode(secretKey);
    const publicKeyStringB58 = bs58.encode(publicKey);
    return {
        path,
        publicKeyStringB58,
        privateKeyStringB58,
    }
}