import { useRef } from "react";
import { useCrypto, showSeedWords } from "../hooks/useCrypto";
import { Button } from "./ui/Button";
import { DropDownMenu } from "./ui/DropDown";
import { WalletsDashBoard } from "./WalletsDashBoard";
import { WalletSkeleton } from "./ui/WalletSkeleton";

export const WalletEntryGate = () => {
  const { isLogin, inputPassword, isLoading, error } = useCrypto();
  const passwordRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <div className="mt-8">
        <WalletSkeleton />
      </div>
    );
  }

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
                    {error&&<p className="text-xs text-red-400 text-center mt-2 italic">
                        if you forgot your password then you would have to re-enter your seed phrase. 
                        As there is no other way to recover your password unless you bruteforce each password.
                    </p>}
                </form>
            </div>
        </div>
      )}
    </>
  );
};