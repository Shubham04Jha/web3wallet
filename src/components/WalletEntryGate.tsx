import { useRef } from "react";
import { useCrypto } from "../hooks/useCrypto";
import { Button } from "./ui/Button";
import { DropDownMenu } from "./ui/DropDown";
import { WalletsDashBoard } from "./WalletsDashBoard";
import { WalletSkeleton } from "./ui/WalletSkeleton";

export const WalletEntryGate = () => {
  const { isLogin, inputPassword, isLoading, error, showSeedWords } = useCrypto();
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
          <DropDownMenu showSeed={showSeedWords} text={"Secret Mnemonics"} />
          <WalletsDashBoard text='Wallets' />
        </>
      ) : (
        <div className='flex flex-col items-center justify-center h-100 animate-[fade-in_0.5s_ease-out]'>
          <div className="glass-panel p-10 rounded-2xl w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-text-accent to-purple-500 rounded-full mx-auto mb-4 blur-[20px] opacity-50" />
              <h2 className="text-text-primary text-2xl font-bold relative -mt-12">Unlock Wallet</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                className="p-4 rounded-xl bg-bg-primary/50 text-text-primary outline-none border border-white/10 focus:border-text-accent focus:ring-1 focus:ring-text-accent transition-all placeholder:text-text-secondary/50"
                placeholder="Enter Master Password"
                ref={passwordRef}
                autoFocus
              />
              <Button type="submit" size="lg" className="w-full shadow-lg shadow-button-primary/20">Unlock</Button>
              {error && <p className="text-xs text-error text-center mt-2 italic bg-error/10 p-2 rounded border border-error/20">
                Wrong password. If you forgot it, you must reset your wallet using your seed phrase.
              </p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
};