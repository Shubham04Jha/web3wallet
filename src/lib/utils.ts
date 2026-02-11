import { type ClassValue, clsx } from "clsx"
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function copyToClipBoard(text: string){
    navigator.clipboard.writeText(text);
    toast.info('Copied successfully',{
        // className: "!bg-navy-900 !border !border-teal !text-biege !font-bold ",
        progressClassName: "!bg-teal",
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}