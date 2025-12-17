import { Asterisk, Eye, EyeOff, Trash } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./Button"
import { useState } from "react"

interface WalletContainerInterface extends React.HTMLAttributes<HTMLDivElement>{
    // className mainly for the col-span for row fit to boxes.
}
export const WalletContainer = ({className,...props}: WalletContainerInterface)=>{
    return <div {...props} className={cn("border border-white w-full rounded-xl ",className)}>
        <div className="flex justify-between mx-8 my-4">
            <p className="text-4xl font-bold">Wallet1</p>
            <Button className=" hover:bg-teal-900" variant="icon" ><Trash className="my-icon" size={16}/></Button>
        </div>
        <div className="rounded-xl py-4 px-8 gap-y-2 flex flex-col bg-navy-400">
            <KeyDisplay keyType="Public Key" keyVal="4eeHwagJMgkaSzdmegPxXmgb5g5nfdWcSQQHauDMh1PA" />
            <KeyDisplay keyVal="zfgNDLuDvHu3idGm2jjkMW8T5a2pcaxBGVBxVgYCPr72ffoFtNh2MppMynAMAqU6S7YDf7yGuAB54pYTDQMDqhv" isPrivate={true} keyType="Private Key" />
            <div className="flex text-gray-900">
                <Asterisk className="" size={16}/>
                <p className="text-sm text-gray-900">Click on key to copy</p>
            </div>
        </div>
    </div>
}
interface KeyDisplay extends React.HTMLAttributes<HTMLDivElement>{
    keyVal: string,
    isPrivate?: boolean,
    keyType: string
}
const KeyDisplay = ({keyVal,keyType,isPrivate=false}: KeyDisplay)=>{
    const [visible,setVisible] = useState<boolean>(!isPrivate);
    // let dots = "• ".repeat(keyVal.length-1)+"•";
    return (
        <>
            <p className="font-medium text-2xl hover:cursor-default">{keyType}</p>
            <div className="flex justify-between items-center">
                <p className={cn("hover:text-white text-gray-900 hover:cursor-pointer my-2",!visible&&"masked tracking-widest",!visible&&"font-bold")}>{keyVal}</p>
                {isPrivate&&<Button className=" hover:bg-teal-900 " variant="icon" size="icon" onClick={()=>setVisible(prev=>!prev)}>
                    {visible?<Eye  size={16}/>:<EyeOff  size={16} />}
                    </Button>}
            </div>
        </>)
}





