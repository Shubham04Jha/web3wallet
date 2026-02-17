// need a path to function mapper for generate wallet logic.
import { Cog, Trash2 } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'
import { WalletContainer } from './ui/WalletContainer'
import { useWallet } from '../context/WalletContext'
import { useCrypto, useCryptoChain } from '../hooks/useCrypto'
import { getSolanaWalletByAccount } from '../lib/walletGen'

import type { PathPrefix } from '../lib/types'
import { pathToChain } from '../lib/utils'

interface WalletsDashBoardInterface {
    text: string,
    path: PathPrefix
}

export const WalletsDashBoard = ({ text, path }: WalletsDashBoardInterface) => {
    const { chain } = useWallet();
    const wallets = chain[path];
    const { showRecoveryPhrase } = useCrypto();
    const { encryptAndStoreWallet, showPrivateKeyFromIdx, clearWallets: clearWalletsOfCurrentChain} = useCryptoChain(path);

    return <div className={cn("text-text-primary my-8 animate-fade-in")}>
        <div className={cn("flex flex-col md:flex-row gap-y-4 justify-between items-center mb-8")}>
            <p className='font-bold text-4xl tracking-tight text-gradient'>{text}</p>
            <div className={cn("flex gap-4 ")}>
                <Button icon={<Cog className='my-icon' />}
                    onClick={async () => {
                        const recoveryPhrase = await showRecoveryPhrase();
                        if (!recoveryPhrase) {
                            console.log('Recovery Phrase not found');
                            return;
                        }
                        const keyRes = await getSolanaWalletByAccount(recoveryPhrase, wallets.length);
                        await encryptAndStoreWallet(keyRes.path, keyRes.publicKeyStringB58, keyRes.privateKeyStringB58);
                    }}
                    className="shadow-lg shadow-button-primary/20"
                >Generate Wallet</Button>
                <Button variant='danger' icon={<Trash2 className='my-icon' />}
                    onClick={() => {
                        clearWalletsOfCurrentChain()
                    }}
                >Clear All</Button>
            </div>
        </div>
        <div className="space-y-6">
            {wallets.length === 0 ? (
                <div className="text-center p-12 glass-panel rounded-2xl border-dashed border-2 border-border-card">
                    <p className="text-text-secondary">No wallets generated yet for {pathToChain(path)}</p>
                </div>
            ) : (
                wallets.map((wallet, idx) =>
                    <WalletContainer
                        publicKey={wallet.publicKeyString}
                        getPrivateKey={() => showPrivateKeyFromIdx(idx)}
                        index={idx}
                        key={idx}
                    />
                )
            )}
        </div>
    </div>
}

