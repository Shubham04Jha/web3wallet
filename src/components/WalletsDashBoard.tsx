import { Cog, Shredder, Trash } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'
import { WalletContainer } from './ui/WalletContainer'

interface WalletsDashBoardInterface{
    text: string,
}

export const WalletsDashBoard = ({text}: WalletsDashBoardInterface)=>{
    return <div className= {cn("text-white my-8")}>
        <div className={cn("flex flex-col md:flex-row gap-y-4 justify-between")}>
            <p className='font-bold text-4xl'>{text}</p>
            <div className={cn("flex gap-4 ")}>
                <Button icon={<Cog className='my-icon'/>}>Generate</Button>
                <Button variant='danger' icon={<Shredder className='my-icon'/>}>Clear Wallets</Button>
            </div>
        </div>
        <WalletContainer className='mt-8'/>
    </div>
}

