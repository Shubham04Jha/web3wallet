import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "icon" | "ghost",
    size?: "xs" | "sm" | "lg" | "icon",
    icon?: React.ReactNode
}
export const Button = ({ children, variant = "primary", size = "sm", icon, className, disabled, ...props }: ButtonProps) => {
    const base = cn(
        "rounded-xl flex justify-center items-center font-semibold outline-none transition-all duration-300",
        "hover:cursor-pointer active:scale-95 disabled:active:scale-100",
        "focus-visible:ring-2 focus-visible:ring-text-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
    );
    const variants = {
        primary: "bg-button-primary text-button-text hover:bg-button-primary-hover shadow-lg shadow-button-primary/20 hover:shadow-button-primary/40",
        secondary: "bg-bg-tertiary text-text-primary hover:bg-bg-secondary border border-border-card hover:border-text-accent/50",
        danger: "bg-transparent text-error hover:bg-error/10 border border-error",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5",
        icon: "p-2 hover:bg-white/10 rounded-full"
    }
    const sizes = {
        xs: "px-2 py-1 text-xs",
        sm: "px-4 py-2.5 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "p-2"
    }
    const disabledStyles = "opacity-50 cursor-not-allowed hover:cursor-not-allowed grayscale";

    return <button
        {...props} disabled={disabled} className={
            cn(base, sizes[size], variants[variant], disabled && disabledStyles, className)
        }>
        <div className="text-wrapper">
            {children}
            {icon}
        </div>
    </button>
}