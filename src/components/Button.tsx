"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "lg" | "md" | "sm";
  appearance?: "default" | "error" | "error-subtle" | "subtle" | "ghost";
  loading?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    size = "md",
    appearance = "default",
    loading = false,
    children,
    className,
    disabled,
    ...props
  },
  ref,
) {
  const baseClasses =
    "inline-flex items-center justify-center relative overflow-hidden transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focused disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled disabled:border-transparent disabled:before:hidden disabled:shadow-none disabled:hover:bg-bg-disabled";

  const sizeClasses = {
    lg: "h-10 px-4 rounded-lg text-body-14-medium gap-1",
    md: "h-8 px-3 rounded-md text-body-12-medium gap-1",
    sm: "h-6 px-2 rounded-sm text-body-12-medium gap-0.5",
  }[size];

  const appearanceClasses = {
    default:
      "bg-bg-neutral-bold-default text-text-inverse hover:bg-bg-neutral-bold-hovered active:bg-bg-neutral-bold-pressed shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.4)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/0 before:to-white/20 before:rounded-[inherit] before:pointer-events-none",
    error:
      "bg-bg-error-bold-default text-text-inverse hover:bg-bg-error-bold-hovered active:bg-bg-error-bold-pressed shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.4)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/0 before:to-white/16 before:rounded-[inherit] before:pointer-events-none",
    "error-subtle":
      "bg-bg-neutral-subtle-default text-text-error border border-border-default hover:bg-bg-neutral-subtle-hovered active:bg-bg-neutral-subtle-pressed before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/[0.03] dark:before:to-white/[0.03] before:rounded-[inherit] before:pointer-events-none",
    subtle:
      "bg-bg-neutral-subtle-default border border-border-default text-text-default hover:bg-bg-neutral-subtle-hovered active:bg-bg-neutral-subtle-pressed before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/[0.03] dark:before:to-white/[0.03] before:rounded-[inherit] before:pointer-events-none",
    ghost:
      "bg-transparent text-text-default hover:bg-interaction-hovered active:bg-interaction-pressed",
  }[appearance];

  const spinnerSizeClasses = {
    lg: "size-5",
    md: "size-4",
    sm: "size-3.5",
  }[size];

  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses,
        appearanceClasses,
        loading && "pointer-events-none",
        className,
      )}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <span
          className={`absolute animate-spin border-2 border-current border-t-transparent rounded-full ${spinnerSizeClasses}`}
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          "inline-flex items-center gap-1",
          loading && "invisible",
        )}
      >
        {children}
      </span>
    </button>
  );
});
