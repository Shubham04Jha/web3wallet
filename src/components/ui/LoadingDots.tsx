import { cn } from "../../lib/utils";

interface LoadingDotsProps {
    className?: string;
}

export const LoadingDots = ({ className }: LoadingDotsProps) => {
    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <div className="dot-bounce dot-bounce-1" />
            <div className="dot-bounce dot-bounce-2" />
            <div className="dot-bounce dot-bounce-3" />
        </div>
    );
};
