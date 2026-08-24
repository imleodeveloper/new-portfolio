import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all flex items-center justify-center overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter z-10",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          "glass-button-wrap cursor-pointer rounded-full relative p-[1px] bg-gradient-to-b from-white/20 to-transparent inline-flex",
          className
        )}
      >
        <button
          className={cn("glass-button w-full", glassButtonVariants({ size }))}
          ref={ref}
          {...props}
        >
          <span
            className={cn(
              glassButtonTextVariants({ size }),
              contentClassName
            )}
          >
            {children}
          </span>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 hover:opacity-100 z-0"></div>
        </button>
        <div className="glass-button-shadow rounded-full absolute -inset-1 bg-white/5 blur-md -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
