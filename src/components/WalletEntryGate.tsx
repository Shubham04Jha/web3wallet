import { useRef } from "react";
import { useCrypto } from "../hooks/useCrypto";
import { Button } from "./ui/Button";
import { DropDownMenu } from "./ui/DropDown";
import { WalletsDashBoard } from "./WalletsDashBoard";
import { WalletSkeleton } from "./ui/WalletSkeleton";
import { Tabs } from "radix-ui";
import { cn } from "../lib/utils";

export const WalletEntryGate = () => {
  const { isLogin, inputPassword, isLoading, error, showRecoveryPhrase } = useCrypto();
  if (isLoading) {
    return (
      <div className="mt-8">
        <WalletSkeleton />
      </div>
    );
  }
  return (
    <>
      {isLogin ? (
        <div className="flex flex-col gap-4 items-center justify-start">
          <DropDownMenu showRecoveryPhrase={showRecoveryPhrase} text={"Recovery Phrase"} />
          <Tabs.Root defaultValue="tab1" className="w-full mx-auto" >
            <Tabs.List className="flex gap-4">
              <Tabs.Trigger value="tab1" asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "border border-border-card",
                    "data-[state=active]:bg-text-accent/10 data-[state=active]:text-text-accent data-[state=active]:border-text-accent/50",
                    "transition-all duration-300"
                  )}
                >
                  Solana
                </Button>
              </Tabs.Trigger>
              <Tabs.Trigger value="tab2" asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "border border-border-card",
                    "data-[state=active]:bg-text-accent/10 data-[state=active]:text-text-accent data-[state=active]:border-text-accent/50",
                    "transition-all duration-300"
                  )}
                >
                  Ethereum
                </Button>
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">
              <WalletsDashBoard text='Solana Wallets' path="m/44'/501'" />
            </Tabs.Content>
            <Tabs.Content value="tab2">
              <WalletsDashBoard text='Ethereum Wallets' path="m/44'/60'" />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      ) : (
        <UnlockWallet inputPassword={inputPassword} error={error} />
      )}
    </>
  );
};

const UnlockWallet = ({ inputPassword, error }: { inputPassword: (password: string) => void, error: string | null }) => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordRef.current) {
      inputPassword(passwordRef.current.value);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center h-100 animate-[fade-in_0.5s_ease-out]'>
      <div className="glass-panel p-10 rounded-2xl w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-text-accent to-purple-500 rounded-full mx-auto mb-4 blur-[20px] opacity-50" />
          <h2 className="text-text-primary text-2xl font-bold relative -mt-12">Unlock Wallet</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            className="p-4 rounded-xl bg-bg-primary/50 text-text-primary outline-none border borderorder-card focus:border-text-accent focus:ring-1 focus:ring-text-accent transition-all placeholder:text-text-secondary/50"
            placeholder="Enter Master Password"
            ref={passwordRef}
            autoFocus
          />
          <Button type="submit" size="lg" className="w-full shadow-lg shadow-button-primary/20">Unlock</Button>
          {error && <p className="text-xs text-error text-center mt-2 italic bg-error/10 p-2 rounded border border-error/20">
            Wrong password. If you forgot it, you must reset your wallet using your Recovery Phrase.
          </p>}
        </form>
      </div>
    </div>
  )
}