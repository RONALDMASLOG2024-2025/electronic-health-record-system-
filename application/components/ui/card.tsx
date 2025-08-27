import * as React from "react";
// ...existing code...
import clsx from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl bg-white shadow-md border border-blue-100 p-6",
        className
      )}
      {...props}
    />
  );
}
