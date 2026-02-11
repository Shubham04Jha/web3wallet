import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: "primary"|"secondary"|"danger"|"icon",
    size?: "xs"|"sm"|"lg"|"icon",
    icon?: React.ReactNode
}
export const Button= ({children, variant="primary", size="sm", icon, className, disabled,  ...props}:ButtonProps)=>{
    const base = cn(
        "rounded-md flex justify-center items-center font-semibold bg-transparent border-0 outline-none transition-all duration-200",
        "hover:cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
    );
    const variants = {
        primary: "bg-biege hover:bg-taupe border-yellow-600 text-black",
        secondary:"bg-teal hover:bg-teal-900 border-white",
        danger:"bg-red-600 hover:bg-red-700 text-white ",
        icon:"w-fit outline-white outline-1"
    }
    const sizes={
        xs: "px-0.5 py-0",
        sm: "px-3 py-2 text-sm",
        lg: "px-6 py-3 text-lg",
        icon: "p-2"
    }
    const disabledStyles = "opacity-50 cursor-now-allowed hover:cursor-not-allowed grayscale-[0.5] hover:bg-biege hover:bg-teal";
    return <button
    {...props} disabled={disabled} className={
        cn(base, sizes[size], variants[variant],disabled&&disabledStyles, className )
    }>
        <div className="text-wrapper">
            {children}
            {icon}
        </div>
    </button>
}