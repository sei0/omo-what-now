"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useFieldContext } from "@/components/Field";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "md" | "sm";
  error?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const paddingMap = {
  md: { start: "pl-10", end: "pr-10", default: "pl-3", defaultEnd: "pr-3" },
  sm: { start: "pl-9", end: "pr-9", default: "pl-3", defaultEnd: "pr-3" },
} as const;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "md",
    error: errorProp = false,
    disabled: disabledProp = false,
    startIcon,
    endIcon,
    className,
    id: idProp,
    ...props
  },
  ref,
) {
  const fieldContext = useFieldContext();
  const error = errorProp || (fieldContext?.error ?? false);
  const disabled = disabledProp || (fieldContext?.disabled ?? false);
  const id = idProp ?? fieldContext?.controlId;
  const describedBy =
    props["aria-describedby"] ??
    (fieldContext
      ? [fieldContext.descriptionId, fieldContext.errorId]
          .filter(Boolean)
          .join(" ") || undefined
      : undefined);
  const sizeClasses = {
    md: "h-[42px] rounded-lg text-body-14-regular",
    sm: "h-8 rounded-md text-body-14-regular",
  }[size];

  const pad = paddingMap[size];
  const paddingLeft = startIcon ? pad.start : pad.default;
  const paddingRight = endIcon ? pad.end : pad.defaultEnd;

  const borderClasses = error
    ? "border border-border-error ring-1 ring-border-error"
    : "border border-border-input focus:border-border-focused focus:ring-1 focus:ring-border-focused";

  const iconSizeClasses = {
    md: "size-5",
    sm: "size-4",
  }[size];

  return (
    <div className={cn("relative inline-flex", className)}>
      {startIcon && (
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-icon-subtle flex items-center justify-center",
            iconSizeClasses,
          )}
        >
          {startIcon}
        </span>
      )}
      <input
        ref={ref}
        id={id}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full",
          sizeClasses,
          paddingLeft,
          paddingRight,
          borderClasses,
          "bg-bg-input-default text-text-default outline-none transition-colors placeholder:text-text-placeholder hover:bg-bg-input-hovered disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-bg-input-disabled disabled:text-text-disabled disabled:placeholder:text-text-disabled",
        )}
        {...props}
      />
      {endIcon && (
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-icon-subtle flex items-center justify-center",
            iconSizeClasses,
          )}
        >
          {endIcon}
        </span>
      )}
    </div>
  );
});
