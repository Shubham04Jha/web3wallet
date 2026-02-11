import { AlertDialog } from "radix-ui";
import { Button } from "./Button";

interface ConfirmProps {
    trigger: React.ReactNode;
    title: string;
    description: string;
    onConfirm: () => void;
}

export const ConfirmDialog = ({ trigger, title, description, onConfirm }: ConfirmProps) => {
    return (
        <AlertDialog.Root >
            <AlertDialog.Trigger asChild>
                {trigger}
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                {/* Blurred Overlay */}
                <AlertDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                
                {/* Dialog Content Box */}
                <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md bg-navy-900 border border-navy-400 p-8 rounded-xl shadow-2xl z-50 outline-none animate-in zoom-in-95 fade-in duration-200">
                    <AlertDialog.Title className="text-biege text-2xl font-bold mb-2">
                        {title}
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-teal text-sm mb-8 leading-relaxed">
                        {description}
                    </AlertDialog.Description>
                    
                    <div className="flex justify-between gap-4">
                        <AlertDialog.Cancel asChild>
                            <Button variant="secondary" size="sm">
                                Cancel
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <Button variant="danger" size="sm" onClick={onConfirm}>
                                Proceed
                            </Button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}