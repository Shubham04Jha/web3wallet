import { Select as RadixSelect } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import React from "react";

export const Select = RadixSelect.Root;
export const SelectValue = RadixSelect.Value;

export const SelectTrigger = React.forwardRef<
    React.ComponentRef<typeof RadixSelect.Trigger>,
    React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger>
>(({ className, children, ...props }, ref) => (
    <RadixSelect.Trigger
        ref={ref}
        className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-border-card bg-bg-secondary/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-text-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-bg-secondary",
            className
        )}
        {...props}
    >
        {children}
        <RadixSelect.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
        </RadixSelect.Icon>
    </RadixSelect.Trigger>
));

export const SelectContent = React.forwardRef<
    React.ComponentRef<typeof RadixSelect.Content>,
    React.ComponentPropsWithoutRef<typeof RadixSelect.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <RadixSelect.Portal>
        <RadixSelect.Content
            ref={ref}
            className={cn(
                "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border-card bg-bg-secondary text-text-primary shadow-md animate-in fade-in-80 zoom-in-95",
                position === "popper" &&
                "translate-y-1",
                className
            )}
            position={position}
            {...props}
        >
            <RadixSelect.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                <ChevronUp className="h-4 w-4" />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport
                className={cn(
                    "p-1",
                    position === "popper" &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                <ChevronDown className="h-4 w-4" />
            </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
    </RadixSelect.Portal>
));

export const SelectItem = React.forwardRef<
    React.ComponentRef<typeof RadixSelect.Item>,
    React.ComponentPropsWithoutRef<typeof RadixSelect.Item>
>(({ className, children, ...props }, ref) => (
    <RadixSelect.Item
        ref={ref}
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-white/10 focus:text-text-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <RadixSelect.ItemIndicator>
                <Check className="h-4 w-4" />
            </RadixSelect.ItemIndicator>
        </span>
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
));
