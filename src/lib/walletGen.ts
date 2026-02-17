import { generateMnemonic, mnemonicToSeed, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { HDKey } from '@scure/bip32'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

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

export const getSolanaWalletByAccount = async (mnemonic: string, idx: number) => {
  const normalized = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ')
  const seed = await mnemonicToSeed(normalized);

  const path = `m/44'/501'/${idx}'/0'`

  const hdkey = HDKey.fromMasterSeed(seed)
  const derived = hdkey.derive(path)

  if (!derived.privateKey) {
    throw new Error('Failed to derive private key')
  }

  const keypair = nacl.sign.keyPair.fromSeed(derived.privateKey)
  // console.log(bs58.encode(derived.privateKey))
  // console.log(bs58.encode(keypair.secretKey))
  // console.log(bs58.encode(derived.publicKey));
  // console.log(bs58.encode(keypair.publicKey))
  return {
    path,
    publicKeyStringB58: bs58.encode(keypair.publicKey),
    privateKeyStringB58: bs58.encode(keypair.secretKey),
  }
}
