import { cn } from "../lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <img 
      src="/web_wallet_logo.svg" 
      alt="W3 Wallet Logo" 
      className={cn("h-12 w-auto", className)} 
    />
  );
};