import { cn } from "../lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div 
      className={cn("h-12 w-14", className)} 
      style={{
        // Uses the gradient background from your CSS
        background: "linear-gradient(to right, var(--color-text-accent), #a855f7)", // Matching your text-gradient colors
        // Projects the image as a mask over that background
        WebkitMaskImage: "url('/web3faviconv2.svg')",
        WebkitMaskPosition: "center",
        // WebkitMaskSize: "180%",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskImage: "url('/web3faviconv2.svg')",
        // maskSize: "180%",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center"
      }}
    />
  );
};
