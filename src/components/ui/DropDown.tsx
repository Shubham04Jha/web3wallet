import { useEffect, useState } from "react"
import { cn, copyToClipBoard } from "../../lib/utils"
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";

interface DropDownMenuInterface {
    text: string,
    showSeed: () => Promise<string | null>,
}

export const DropDownMenu = ({ text, showSeed }: DropDownMenuInterface) => {

    const [open, setOpen] = useState<boolean>(false);
    const [items, setItems] = useState<string[]>([]);
    useEffect(() => {
        if (open) {
            showSeed().then(res => {
                if (res) {
                    setItems(res.split(" "));
                }
            }).catch(err => {
                console.log(err.message);
            })
        } else {
            setItems([]);
        }
    }, [open])
    return (
        <div className={cn("rounded-xl w-full text-text-primary font-bold transition-all duration-300 overflow-hidden border border-border-card hover:border-text-accent/30 bg-bg-primary/30")}>
            {!open ? (
                <ConfirmDialog
                    title="Reveal Secret Phrase?"
                    description="Make sure nobody is looking at your screen. These words provide full access to your wallet."
                    onConfirm={() => setOpen(true)}
                    trigger={
                        <div className={cn("text-xl md:text-2xl flex justify-between items-center py-6 px-8 cursor-pointer hover:bg-white/5 transition-colors")}>
                            <p className="tracking-tight">{text}</p>
                            <Button variant="ghost" size="icon" className="text-text-secondary">
                                <ChevronDown size={24} strokeWidth={1.5} />
                            </Button>
                        </div>
                    }
                    allowOutsideClick
                />
            ) : (
                <div
                    onClick={() => setOpen(false)}
                    className={cn("text-xl md:text-2xl flex justify-between items-center py-6 px-8 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors border-b border-border-card")}
                >
                    <p className="tracking-tight text-text-accent">{text}</p>
                    <Button variant="ghost" size="icon" className="text-text-accent">
                        <ChevronUp size={24} strokeWidth={1.5} />
                    </Button>
                </div>
            )}
            {open && <div className="animate-[slide-up_0.3s_ease-out]">
                <div onClick={() => {
                    copyToClipBoard(items.join(' '));
                }}>
                    <ItemsLayer items={items} />
                    <Note />
                </div>
            </div>}
        </div>
    )
}
const Note = () => {
    return <div className={cn("w-fit flex items-center gap-x-2 text-sm my-6 mx-8 font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer group")}>
        <Copy className="w-4 h-4 group-hover:text-text-accent transition-colors" />
        <p>Click anywhere to copy all words</p>
    </div>
}
const Item = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex items-center justify-center px-4 py-3 w-full rounded-lg font-mono text-sm sm:text-base bg-bg-secondary/50 border border-border-card hover:border-text-accent/50 hover:bg-bg-secondary transition-all text-text-primary select-all">
        {children}
    </div>
}
const ItemsLayer = ({ items }: { items: string[] }) => {
    return (
        <div className="grid md:gap-4 gap-3 md:grid-cols-4 grid-cols-2 mx-8 mt-6">
            {items.map((item, i) => <Item key={i}>{item}</Item>)}
        </div>
    )
}