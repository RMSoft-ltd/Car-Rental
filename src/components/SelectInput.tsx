import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  // Core props
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;

  // Grouping
  groups?: {
    label: string;
    options: SelectOption[];
  }[];

  // Customization
  label?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;

  // Accessibility
  id?: string;
  name?: string;
  required?: boolean;
}

export const SelectInput: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  groups,
  label,
  disabled = false,
  className = "w-[180px]",
  triggerClassName,
  contentClassName,
  id,
  name,
  required = false,
}) => {
  // If groups are provided, use them. Otherwise, use flat options.
  const hasGroups = groups && groups.length > 0;

  const renderOptions = (opts: SelectOption[]) =>
    opts.map((option) => (
      <SelectItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
      >
        {option.label}
      </SelectItem>
    ));

  const renderGroups = () =>
    groups!.map((group) => (
      <SelectGroup key={group.label}>
        <SelectLabel>{group.label}</SelectLabel>
        {renderOptions(group.options)}
      </SelectGroup>
    ));

  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectTrigger className={`${className} ${triggerClassName}`} id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {label && !hasGroups && <SelectLabel>{label}</SelectLabel>}
        {hasGroups ? renderGroups() : renderOptions(options)}
      </SelectContent>
    </Select>
  );
};