"use client";

import { useRef } from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { ComboboxRoot } from "@base-ui/react/combobox";
import { CaretDown, Check, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface ComboboxProps<T> {
  items: T[];
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (
    value: T | null,
    eventDetails: ComboboxRoot.ChangeEventDetails,
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  getLabel?: (item: T) => string;
  className?: string;
  popupClassName?: string;
  size?: "md" | "lg";
}

export function Combobox<T>({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Placeholder",
  disabled = false,
  error = false,
  getLabel = (item: T) => String(item),
  className,
  popupClassName,
  size = "md",
}: ComboboxProps<T>) {
  const sizeClasses = size === "lg" ? "h-12 text-body-16-regular" : "h-10 text-body-14-regular";
  return (
    <BaseCombobox.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      itemToStringLabel={(item) => getLabel(item)}
    >
      <div className={cn("relative w-60", className)}>
        <BaseCombobox.Input
          className={cn(
            "w-full rounded-lg border bg-bg-input-default pr-14 pl-3 text-text-default outline-none transition-colors placeholder:text-text-placeholder hover:bg-bg-input-hovered focus:border-border-focused focus:ring-1 focus:ring-border-focused disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-bg-input-disabled disabled:text-text-disabled disabled:placeholder:text-text-disabled",
            sizeClasses,
            error
              ? "border-border-error ring-1 ring-border-error"
              : "border-border-input",
          )}
          placeholder={placeholder}
        />
        <BaseCombobox.Clear className="absolute top-1/2 right-7 -translate-y-1/2 inline-flex size-6 items-center justify-center rounded-sm text-icon-subtle transition-colors hover:bg-interaction-hovered active:bg-interaction-pressed">
          <X size={16} weight="bold" />
        </BaseCombobox.Clear>
        <BaseCombobox.Icon className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-icon-subtle">
          <CaretDown size={16} weight="bold" />
        </BaseCombobox.Icon>
      </div>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={4}>
          <BaseCombobox.Popup
            className={cn(
              "w-60 max-h-[320px] overflow-auto origin-[var(--transform-origin)] rounded-lg bg-elevation-surface-overlay-default p-1.5 shadow-[0_6px_12px_0_var(--color-elevation-shadow-default),0_0px_1px_0_var(--color-elevation-shadow-strong)] outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              popupClassName,
            )}
          >
            <BaseCombobox.List>
              {(item: T) => (
                <BaseCombobox.Item
                  key={getLabel(item)}
                  value={item}
                  className="group flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-body-14-regular text-text-default outline-none select-none data-[highlighted]:bg-interaction-hovered data-[selected]:text-body-14-medium"
                >
                  <BaseCombobox.ItemIndicator
                    className="invisible inline-flex size-4 items-center justify-center text-text-default data-[selected]:visible"
                    keepMounted
                  >
                    <Check size={14} weight="bold" />
                  </BaseCombobox.ItemIndicator>
                  {getLabel(item)}
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
            <BaseCombobox.Empty className="flex items-center px-2 py-1.5 text-body-14-regular text-text-subtle">
              No item found
            </BaseCombobox.Empty>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}

interface MultiComboboxProps<T> {
  items: T[];
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (
    value: T[],
    eventDetails: ComboboxRoot.ChangeEventDetails,
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  getLabel?: (item: T) => string;
  className?: string;
}

export function MultiCombobox<T>({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Placeholder",
  disabled = false,
  error = false,
  getLabel = (item: T) => String(item),
  className,
}: MultiComboboxProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <BaseCombobox.Root
      multiple
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      itemToStringLabel={(item) => getLabel(item)}
    >
      <div className={cn("relative inline-flex", className)}>
        <BaseCombobox.Chips
          ref={containerRef}
          className={cn(
            "flex min-h-10 w-60 flex-wrap items-center gap-1 rounded-lg border bg-bg-input-default p-1.5 transition-colors",
            error
              ? "border-border-error ring-1 ring-border-error"
              : "border-border-input focus-within:border-border-focused focus-within:ring-1 focus-within:ring-border-focused",
          )}
        >
          <BaseCombobox.Value>
            {(selectedValues: T[]) => (
              <>
                {selectedValues.map((item) => (
                  <BaseCombobox.Chip
                    key={getLabel(item)}
                    className="inline-flex items-center gap-1 rounded-md bg-interaction-hovered py-0.5 pr-1 pl-2 text-body-14-medium text-text-default"
                  >
                    {getLabel(item)}
                    <BaseCombobox.ChipRemove className="inline-flex size-6 items-center justify-center rounded-sm text-icon-subtle transition-colors hover:bg-interaction-pressed">
                      <X size={12} weight="bold" />
                    </BaseCombobox.ChipRemove>
                  </BaseCombobox.Chip>
                ))}
                <BaseCombobox.Input
                  className="min-w-16 flex-1 bg-transparent py-0.5 pl-1.5 text-body-14-regular text-text-default outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-disabled disabled:placeholder:text-text-disabled"
                  placeholder={selectedValues.length === 0 ? placeholder : ""}
                />
              </>
            )}
          </BaseCombobox.Value>
        </BaseCombobox.Chips>
      </div>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={4} anchor={containerRef}>
          <BaseCombobox.Popup className="w-60 origin-[var(--transform-origin)] rounded-lg bg-elevation-surface-overlay-default p-1.5 shadow-[0_6px_12px_0_var(--color-elevation-shadow-default),0_0px_1px_0_var(--color-elevation-shadow-strong)] outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <BaseCombobox.List>
              {(item: T) => (
                <BaseCombobox.Item
                  key={getLabel(item)}
                  value={item}
                  className="group flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-body-14-regular text-text-default outline-none select-none data-[highlighted]:bg-interaction-hovered data-[selected]:text-body-14-medium"
                >
                  <BaseCombobox.ItemIndicator
                    className="invisible inline-flex size-4 items-center justify-center text-text-default data-[selected]:visible"
                    keepMounted
                  >
                    <Check size={14} weight="bold" />
                  </BaseCombobox.ItemIndicator>
                  {getLabel(item)}
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
            <BaseCombobox.Empty className="flex items-center px-2 py-1.5 text-body-14-regular text-text-subtle">
              No item found
            </BaseCombobox.Empty>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
