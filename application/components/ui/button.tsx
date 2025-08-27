import * as React from "react";

// Simple cn utility for class merging
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

const variantClasses = {
  default: "bg-blue-700 text-white hover:bg-blue-800",
  outline: "border border-blue-700 text-blue-700 bg-white hover:bg-blue-50",
  ghost: "bg-transparent text-blue-700 hover:bg-blue-100",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "rounded-lg font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label={props['aria-label'] || props.children?.toString()}
      {...props}
    />
  )
);
Button.displayName = "Button";
