import { cn } from "../lib/utils"
import { Button } from "./ui/Button"
import { LogOut, Shredder, Moon, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ConfirmDialog } from "./ui/ConfirmDialog"
import { useTheme } from "../context/ThemeContext"

export const Header = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        window.location.reload();
    };

    const handleForget = () => {
        localStorage.clear();
        navigate('/get-started');
        window.location.reload();
    };

    return (
        <div className={cn("w-full flex flex-col md:flex-row gap-3 items-center justify-between mb-6 md:mb-12 z-20 relative")}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="relative">
                    <div className="absolute inset-0 bg-text-accent/20 blur-xl rounded-full transition-colors" />
                    <img src="web3walletlogo3.png" className="h-12 w-auto relative z-10" />
                </div>
                <p className="font-bold text-3xl tracking-tight text-gradient transition-all">W3 Wallet</p>
            </div>

            <div className="flex gap-4 items-center justify-center ">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-text-secondary hover:text-text-primary mr-2"
                    title={theme === 'modern' ? "Switch to Classic Theme" : "Switch to Modern Theme"}
                >
                    {theme === 'modern' ? <Moon size={20} /> : <Sun size={20} />}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    icon={<LogOut size={18} />}
                    onClick={handleLogout}
                    className=""
                >
                    Logout
                </Button>
                <ConfirmDialog
                    title="Delete Wallet Permanently?"
                    description="CRITICAL: This will remove your wallet from this device. You will need your seed phrase to recover your funds."
                    onConfirm={handleForget}
                    trigger={
                        <Button
                            variant="danger"
                            size="sm"
                            icon={<Shredder size={18} />}
                        >
                            Forget
                        </Button>
                    }
                />
            </div>
        </div>
    )
}
