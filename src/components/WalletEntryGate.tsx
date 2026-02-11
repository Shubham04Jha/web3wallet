import { useRef } from "react";
import { useCrypto, showSeedWords } from "../hooks/useCrypto";
import { Button } from "./ui/Button";
import { DropDownMenu } from "./ui/DropDown";
import { WalletsDashBoard } from "./WalletsDashBoard";

export const WalletEntryGate = () => {
  const { isLogin, inputPassword, isLoading } = useCrypto();
  const passwordRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <div className="text-white">Loading Store...</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordRef.current) {
      inputPassword(passwordRef.current.value);
    }
  };

  return (
    <>
      {isLogin ? (
        <>
            <DropDownMenu showSeed={showSeedWords} text={"Secret Mnemonics"}/>
            <WalletsDashBoard text='Wallets'/>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center h-100'>
            <div className="bg-navy-900 border border-navy-400 p-8 rounded-xl w-full max-w-sm shadow-2xl">
                <h2 className="text-biege text-xl font-bold mb-4">Unlock Wallet</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                    type="password" 
                    className="p-3 rounded bg-navy-400 text-white outline-none border border-transparent focus:border-teal" 
                    placeholder="Enter Master Password"
                    ref={passwordRef} 
                    autoFocus
                    />
                    <Button type="submit">Unlock</Button>
                    <p className="text-xs text-red-400 text-center mt-2 italic">
                        Note: Entering the wrong password will fail to derive the key.
                    </p>
                </form>
            </div>
        </div>
      )}
    </>
  );
};