import { cn } from "../lib/utils"
import { Button } from "./ui/Button"
import { LogOut, Shredder } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ConfirmDialog } from "./ui/ConfirmDialog"

export const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        window.location.reload(); 
    };

    const handleForget = () => {
        localStorage.clear();
        navigate('/get-started');
        window.location.reload();
    };

    return (
        <div className={cn("w-full grid grid-cols-120 items-center mb-8 ")}>
            <p className="font-bold text-white text-4xl mb-4 text-center col-span-85">W3 Wallet</p>
            
            <div className="flex gap-4 col-span-35 justify-between">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    icon={<LogOut size={20}/>}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
                
                {/* Custom local Confirm Dialog for the destructive Forget action */}
                <ConfirmDialog 
                    title="Delete Wallet Permanently?"
                    description="CRITICAL: This will remove your wallet from this device. You will need your seed phrase to recover your funds."
                    onConfirm={handleForget}
                    trigger={
                        <Button 
                            variant="danger" 
                            size="sm" 
                            icon={<Shredder size={20}/>}
                        >
                            Forget Wallet
                        </Button>
                    }
                />
            </div>
        </div>
    )
}
