import { generateMnemonic, mnemonicToSeed, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { HDKey } from '@scure/bip32'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

export const getNewSeedPhrase = () => {
  return generateMnemonic(wordlist)
}

export const isValidSeedPhrase = (mnemonic: string): boolean => {
  try {
    const normalized = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ')
    return validateMnemonic(normalized, wordlist);
  } catch {
    return false
  }
}

export const getSolanaWalletByAccount = async (mnemonic: string, idx: number) => {
  const seed = await mnemonicToSeed(mnemonic)

  const path = `m/44'/501'/${idx}'/0'`

  const hdkey = HDKey.fromMasterSeed(seed)
  const derived = hdkey.derive(path)

  if (!derived.privateKey) {
    throw new Error('Failed to derive private key')
  }

  const keypair = nacl.sign.keyPair.fromSeed(derived.privateKey)

  return {
    path,
    publicKeyStringB58: bs58.encode(keypair.publicKey),
    privateKeyStringB58: bs58.encode(keypair.secretKey),
  }
}
