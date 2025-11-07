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

// // Example usage components:

// // Basic select
// export function FruitSelect() {
//   const fruits: SelectOption[] = [
//     { value: "apple", label: "Apple" },
//     { value: "banana", label: "Banana" },
//     { value: "blueberry", label: "Blueberry" },
//     { value: "grapes", label: "Grapes" },
//     { value: "pineapple", label: "Pineapple" },
//   ]

//   return (
//     <ReusableSelect
//       options={fruits}
//       placeholder="Select a fruit"
//       label="Fruits"
//     />
//   )
// }

// // Grouped select
// export function FoodSelect() {
//   const foodGroups = [
//     {
//       label: "Fruits",
//       options: [
//         { value: "apple", label: "Apple" },
//         { value: "banana", label: "Banana" },
//       ]
//     },
//     {
//       label: "Vegetables",
//       options: [
//         { value: "carrot", label: "Carrot" },
//         { value: "broccoli", label: "Broccoli" },
//       ]
//     }
//   ]

//   return (
//     <ReusableSelect
//       groups={foodGroups}
//       placeholder="Select a food"
//       className="w-[200px]"
//     />
//   )
// }

// // Controlled select with state
// export function ControlledSelectExample() {
//   const [selectedValue, setSelectedValue] = React.useState("")

//   const options: SelectOption[] = [
//     { value: "option1", label: "Option 1" },
//     { value: "option2", label: "Option 2" },
//     { value: "option3", label: "Option 3", disabled: true },
//   ]

//   return (
//     <div className="space-y-2">
//       <ReusableSelect
//         options={options}
//         value={selectedValue}
//         onValueChange={setSelectedValue}
//         placeholder="Choose an option"
//         label="Options"
//       />
//       <p className="text-sm text-gray-600">
//         Selected: {selectedValue || "Nothing"}
//       </p>
//     </div>
//   )
// }

// // Form integration example
// export function FormSelect() {
//   const options: SelectOption[] = [
//     { value: "us", label: "United States" },
//     { value: "ca", label: "Canada" },
//     { value: "uk", label: "United Kingdom" },
//   ]

//   return (
//     <form className="space-y-4">
//       <div>
//         <label htmlFor="country-select" className="block text-sm font-medium mb-2">
//           Country *
//         </label>
//         <ReusableSelect
//           id="country-select"
//           name="country"
//           options={options}
//           placeholder="Select your country"
//           required
//           className="w-full"
//         />
//       </div>
//       <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
//         Submit
//       </button>
//     </form>
//   )
// }
