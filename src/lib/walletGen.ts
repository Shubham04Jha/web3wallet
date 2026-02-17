import { generateMnemonic, mnemonicToSeed as mnemonicToSeedWeb, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { HDKey as WebEtherHDKey } from '@scure/bip32'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import {mnemonicToSeed } from 'bip39';
import { Keypair } from '@solana/web3.js'
import {derivePath} from 'ed25519-hd-key'
import { deprecate } from 'util';

export const getNewRecoveryPhrase = () => {
  return generateMnemonic(wordlist)
}

export const isValidRecoveryPhrase = (mnemonic: string): boolean => {
  try {
    const normalized = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ');
    const res = validateMnemonic(normalized, wordlist);
    return res;
  } catch {
    return false
  }
}

export const getSolanaWalletByIdx = async(recoveryPhrase: string, idx: number)=>{
  const normalized = recoveryPhrase.trim().toLowerCase().replace(/\s+/g, ' ');
  const seed = await mnemonicToSeed(normalized);
  const path = `m/44'/501'/${idx}'/0'`
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const keypair = Keypair.fromSecretKey(secret);
  return {
    path,
    publicKeyStringB58: bs58.encode(keypair.publicKey.toBuffer()),
    privateKeyStringB58: bs58.encode(keypair.secretKey),
  }
}

