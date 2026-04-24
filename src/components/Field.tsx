"use client";

import { Field as BaseField } from "@base-ui/react/field";
import {
  createContext,
  useContext,
  useId,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

interface FieldContextValue {
  controlId: string;
  descriptionId: string | undefined;
  errorId: string | undefined;
  error: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return useContext(FieldContext);
}

interface FieldProps {
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  name?: string;
  disabled?: boolean;
}

export function Field({
  label,
  description,
  error,
  children,
  className,
  name,
  disabled = false,
}: FieldProps) {
  const generatedId = useId();
  const controlId = `field-${generatedId}`;
  const descriptionId = description ? `field-desc-${generatedId}` : undefined;
  const errorId = error ? `field-error-${generatedId}` : undefined;

  return (
    <FieldContext.Provider
      value={{
        controlId,
        descriptionId,
        errorId,
        error: !!error,
        disabled,
      }}
    >
      <BaseField.Root
        invalid={!!error}
        name={name}
        disabled={disabled}
        className={cn("flex flex-col gap-1", className)}
      >
        {label && (
          <label
            htmlFor={controlId}
            className="text-body-12-medium text-text-subtle"
          >
            {label}
          </label>
        )}
        {children}
        {description && (
          <p id={descriptionId} className="text-body-12-regular text-text-subtle">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-body-12-regular text-text-error">
            {error}
          </p>
        )}
      </BaseField.Root>
    </FieldContext.Provider>
  );
}

