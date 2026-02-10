import { Cog, Shredder } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'
import { WalletContainer } from './ui/WalletContainer'
import { clearWallets, WalletStore } from '../lib/store'
import { encryptAndStoreWallet, showPrivateKeyFromIdx, showSeedWords } from '../hooks/useCrypto'
import { useState } from 'react'
import { getSolanaWalletByAccount } from '../lib/walletGen'

interface WalletsDashBoardInterface{
    text: string,
}

export const WalletsDashBoard = ({text}: WalletsDashBoardInterface)=>{
    const [,setTick] = useState(0);
    const refresh = ()=>{
        setTick(t=>t+1);
    }
    return <div className= {cn("text-white my-8")}>
        <div className={cn("flex flex-col md:flex-row gap-y-4 justify-between")}>
            <p className='font-bold text-4xl'>{text}</p>
            <div className={cn("flex gap-4 ")}>
                <Button icon={<Cog className='my-icon'/>}
                onClick={async ()=>{
                    const seed = await showSeedWords();
                    if(!seed){
                        console.log('Seed not found');
                        return;
                    }
                    const keyRes = await getSolanaWalletByAccount(seed, WalletStore.wallets.length);
                    await encryptAndStoreWallet(keyRes.path, keyRes.publicKeyStringB58, keyRes.privateKeyStringB58);
                    refresh();
                }}
                >Generate</Button>
                <Button variant='danger' icon={<Shredder className='my-icon'/>}
                onClick={()=>{
                    clearWallets();
                    refresh();
                }}
                >Clear Wallets</Button>
            </div>
        </div>
        {WalletStore.wallets.map((wallet,idx)=>
            <WalletContainer publicKey={ wallet.publicKeyString} getPrivateKey={()=>showPrivateKeyFromIdx(idx)}
            index={idx} className='mt-8' key={idx}/>
        )}
        
    </div>
}

