import type { PathPrefix } from './types';
import bs58 from 'bs58'
import { mnemonicToSeed,validateMnemonic, generateMnemonic } from 'bip39';
import { derivePath } from 'ed25519-hd-key'
import { Keypair } from '@solana/web3.js'
import nacl from 'tweetnacl'
import { Wallet, HDNodeWallet } from "ethers";

export const getNewRecoveryPhrase = () => {
  return generateMnemonic()
}

export const isValidRecoveryPhrase = (mnemonic: string): boolean => {
  try {
    const normalized = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ');
    const res = validateMnemonic(normalized);
    return res;
  } catch {
    return false
  }
}

const getSolanaWalletByIdx = async (recoveryPhrase: string, idx: number) => {
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

const getEtheriurmWalletByIdx = async (recoveryPhrase: string, idx: number) => {
  const normalized = recoveryPhrase.trim().toLowerCase().replace(/\s+/g, ' ');
  const seed = await mnemonicToSeed(normalized);
  const path = `m/44'/60'/${idx}'/0'`
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(path);
  const wallet = new Wallet(child.privateKey);
  return {
    path,
    publicKeyStringB58: wallet.address,
    privateKeyStringB58: wallet.privateKey,
  }
}

export const getWalletGeneratorByPathPrefix: {
  [k in PathPrefix]: (recoveryPhrase: string, idx: number)
    => Promise<{
      path: string,
      publicKeyStringB58: string,
      privateKeyStringB58: string
    }>
} = {
  "m/44'/501'": getSolanaWalletByIdx,
  "m/44'/60'": getEtheriurmWalletByIdx,
}