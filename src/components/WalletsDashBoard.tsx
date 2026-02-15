import { Cog, Trash2 } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'
import { WalletContainer } from './ui/WalletContainer'
import { useWallet } from '../context/WalletContext'
import { useCrypto } from '../hooks/useCrypto'
import { getSolanaWalletByAccount } from '../lib/walletGen'

interface WalletsDashBoardInterface {
    text: string,
}

export const WalletsDashBoard = ({ text }: WalletsDashBoardInterface) => {
    const { wallets, clearWallets } = useWallet();
    const { showSeedWords, encryptAndStoreWallet, showPrivateKeyFromIdx } = useCrypto(); return <div className={cn("text-text-primary my-8 animate-fade-in")}>
        <div className={cn("flex flex-col md:flex-row gap-y-4 justify-between items-center mb-8")}>
            <p className='font-bold text-4xl tracking-tight text-gradient'>{text}</p>
            <div className={cn("flex gap-4 ")}>
                <Button icon={<Cog className='my-icon' />}
                    onClick={async () => {
                        const seed = await showSeedWords();
                        if (!seed) {
                            console.log('Seed not found');
                            return;
                        }
                        const keyRes = await getSolanaWalletByAccount(seed, wallets.length);
                        await encryptAndStoreWallet(keyRes.path, keyRes.publicKeyStringB58, keyRes.privateKeyStringB58);
                    }}
                    className="shadow-lg shadow-button-primary/20"
                >Generate Wallet</Button>
                <Button variant='danger' icon={<Trash2 className='my-icon' />}
                    onClick={() => {
                        clearWallets()
                    }}
                >Clear All</Button>
            </div>
        </div>
        <div className="space-y-6">
            {wallets.map((wallet, idx) =>
                <WalletContainer publicKey={wallet.publicKeyString} getPrivateKey={() => showPrivateKeyFromIdx(idx)}
                    index={idx} key={idx} />
            )}
        </div>
    </div>
}

