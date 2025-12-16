import { useState } from "react"
import { cn } from "../../lib/utils"
import { ChevronDown,ChevronUp, Copy } from "lucide-react";
import { Button } from "./Button";

interface DropDownMenuInterface{
    text: string,
    items: string[],
}

export const DropDownMenu2 = ({text, items}: DropDownMenuInterface)=>{
    const base = "border-1 border-white py-4 px-12 rounded-sm w-full text-white font-bold hover: cursor-pointer";
    const [open,setOpen] = useState<boolean>(false);
    return (
        <div className={cn(base)}>
            <div onClick={()=>{setOpen(prev=>!prev)}} 
            className={cn("text-4xl flex justify-between py-4")}>
                <p>{text}</p>
                <Button variant="icon" size="xs" className={cn("hover:bg-teal-900")}>
                    {open?<ChevronUp size={32} strokeWidth={1} />:<ChevronDown size={32} strokeWidth={1} />}
                </Button>
            </div>
            {open&&<ItemsLayer items={items}/>}
            {open&&<Note/>}
        </div>
    )
}
export const DropDownMenu = ({text, items}: DropDownMenuInterface)=>{
    const base = "border-1 border-white rounded-sm w-full text-white font-bold hover: cursor-pointer";
    const [open,setOpen] = useState<boolean>(false);
    return (
        <div className={cn(base)}>
            <div onClick={()=>setOpen(prev=>!prev)}
                className={cn("text-4xl flex justify-between py-8 px-12")}>
                    <p>{text}</p>
                <Button variant="icon" size="xs" className={cn("hover:bg-teal-900")}>
                    {open?<ChevronUp size={32} strokeWidth={1} />:<ChevronDown size={32} strokeWidth={1} />}
                </Button>
            </div>
            {open&&<ItemsLayer items={items} />}
            {open&&<Note/>}
        </div>
    )
}
const Note =()=>{
    return <div className={cn("w-fit flex gap-x-4 text-md text-wrapper my-4 mx-12 font-medium text-gray-500 hover:text-white")}>
        <Copy className="my-icon"/>
        <p className="-mt-1">Click anywhere to copy</p>
    </div>
}
const Item = ({children,key}:{children: React.ReactNode, key: number})=>{
    return <div key={key} className="outline-1 outline-white flex items-center px-2 py-4 w-full rounded-sm font-medium text-md bg-navy-400 hover:bg-teal-900">
        {children}
    </div>
}
const ItemsLayer = ({items}: {items: string[]})=>{
    return (
        <div className="grid md:gap-6 gap-2 md:grid-cols-4 grid-cols-2 mx-12">
            {items.map((item,i)=><Item key={i}>{item}</Item>)}
        </div>
    )
}