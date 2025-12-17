import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: "primary"|"secondary"|"danger"|"icon",
    size?: "xs"|"sm"|"lg"|"icon",
    icon?: React.ReactNode
}
export const Button= ({children, variant="primary", size="sm", icon, className, ...props}:ButtonProps)=>{
    const base = "rounded-md flex justify-center items-center font-semibold bg-transparent border-0 outline-none hover:cursor-pointer";
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
    return <button
    {...props} className={
        cn(base, sizes[size], variants[variant], className )
    }>
        <div className="text-wrapper">
            {children}
            {icon}
        </div>
    </button>
}