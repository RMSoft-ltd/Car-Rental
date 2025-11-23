import { Control, Controller, FieldError } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CheckIcon, ChevronDownIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// FormInput Component
// ============================================

interface FormInputProps {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    label: React.ReactNode;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    className?: string;
}

export function FormInput({
    name,
    control,
    label,
    placeholder,
    type = 'text',
    disabled = false,
    className = '',
}: FormInputProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
                // For file inputs, we need to handle them differently
                if (type === 'file') {
                    const existingFile = typeof value === 'string' ? value : null;
                    const hasFile = value instanceof File || existingFile;

                    return (
                        <div className={className}>
                            <Label htmlFor={name} className="block mb-2">
                                {label}
                            </Label>

                            {/* Show existing file info */}
                            {existingFile && (
                                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                                    Current file: {existingFile.split('/').pop()}
                                </div>
                            )}

                            <Input
                                {...field}
                                value={undefined}
                                id={name}
                                type={type}
                                onChange={(e) => {
                                    // For file inputs, pass the File object or keep existing value
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        onChange(files[0]);
                                    } else if (!existingFile) {
                                        onChange(null);
                                    }
                                }}
                                disabled={disabled}
                                className={`h-12 ${error ? 'border-destructive' : ''}`}
                            />

                            {hasFile && (
                                <p className="mt-1.5 text-sm text-gray-600">
                                    {value instanceof File
                                        ? `New file selected: ${value.name}`
                                        : 'Using existing file (upload a new file to replace)'}
                                </p>
                            )}

                            {error && (
                                <p className="mt-1.5 text-sm text-destructive">{error.message}</p>
                            )}
                        </div>
                    );
                }

                // For all other input types, use controlled value
                return (
                    <div className={className}>
                        <Label htmlFor={name} className="block mb-2">
                            {label}
                        </Label>
                        <Input
                            {...field}
                            id={name}
                            type={type}
                            value={value || ''}
                            onChange={onChange}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`h-12 ${error ? 'border-destructive' : ''}`}
                        />
                        {error && (
                            <p className="mt-1.5 text-sm text-destructive">{error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}

// ============================================
// FormSelect Component
// ============================================

interface FormSelectProps {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    label: React.ReactNode;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function FormSelect({
    name,
    control,
    label,
    options,
    placeholder = 'Select an option',
    disabled = false,
    className = '',
}: FormSelectProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={className}>
                    <Label htmlFor={name} className="block mb-2">
                        {label}
                    </Label>
                    <Select
                        value={value || ''}
                        onValueChange={onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className={`w-full !h-12 ${error ? 'border-destructive' : ''}`}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error && (
                        <p className="mt-1.5 text-sm text-destructive">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
}

// ============================================
// FormCombobox Component (Searchable Select)
// ============================================

interface FormComboboxOption {
    value: string;
    label: string;
    description?: string; // For non-form contexts like filters
    icon?: React.ComponentType<{ className?: string }>;
}

// Export option type for use in other components
export type ComboboxOption = FormComboboxOption;

// ============================================
// Core Combobox Component (Standalone)
// Can be used with or without react-hook-form
// ============================================

interface ComboboxProps {
    value?: string;
    onChange: (value: string | undefined) => void;
    options: FormComboboxOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
    loading?: boolean;
    allowCustomValue?: boolean;
    error?: string;
    showLabel?: boolean;
}

export function Combobox({
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    disabled = false,
    loading = false,
    allowCustomValue = false,
    error,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fieldValue = value || '';
    const selectedOption = options.find((option) => option.value === fieldValue);

    // Check if search term matches any existing options
    const hasExactMatch = options.some(
        (option) => option.value.toLowerCase() === searchTerm.toLowerCase()
    );

    const showAddOption = allowCustomValue && searchTerm.trim() !== '' && !hasExactMatch;

    // Filter options based on search term (search both label and description)
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled || loading}
                        className={cn(
                            'w-full justify-between h-10 font-normal',
                            !fieldValue && 'text-muted-foreground',
                            error && 'border-destructive'
                        )}
                    >
                        <div className="flex items-center gap-2 truncate">
                            {selectedOption?.icon && (
                                <selectedOption.icon className="h-4 w-4 shrink-0" />
                            )}
                            <span className="truncate">
                                {loading
                                    ? 'Loading...'
                                    : selectedOption
                                        ? selectedOption.label
                                        : fieldValue || placeholder}
                            </span>
                        </div>
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {showAddOption ? (
                                    <div className="text-sm text-muted-foreground py-6 text-center">
                                        No results found
                                    </div>
                                ) : (
                                    emptyText
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => {
                                            onChange(option.value === fieldValue ? undefined : option.value);
                                            setOpen(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                fieldValue === option.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
                                        )}
                                        <div className="flex flex-col">
                                            <span>{option.label}</span>
                                            {option.description && (
                                                <span className="text-xs text-muted-foreground">
                                                    {option.description}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                                {showAddOption && (
                                    <CommandItem
                                        value={searchTerm}
                                        onSelect={() => {
                                            onChange(searchTerm);
                                            setOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className="border-t"
                                    >
                                        <Button variant={'outline'} className='!text-black font-semibold'>
                                            <Plus className="size-4 shrink-0 opacity-50" />
                                            <span>Add &quot;{searchTerm}&quot;</span>
                                        </Button>
                                    </CommandItem>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && (
                <p className="mt-1.5 text-sm text-destructive">{error}</p>
            )}
        </>
    );
}

// ============================================
// FormCombobox Component (react-hook-form wrapper)
// ============================================

interface FormComboboxProps {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    label: React.ReactNode;
    options: FormComboboxOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
    className?: string;
    allowCustomValue?: boolean;
}

export function FormCombobox({
    name,
    control,
    label,
    options,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    disabled = false,
    className = '',
    allowCustomValue = false,
}: FormComboboxProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className={className}>
                    <Label htmlFor={name} className="block mb-2">
                        {label}
                    </Label>
                    <Combobox
                        value={value}
                        onChange={onChange}
                        options={options}
                        placeholder={placeholder}
                        searchPlaceholder={searchPlaceholder}
                        emptyText={emptyText}
                        disabled={disabled}
                        allowCustomValue={allowCustomValue}
                        error={error?.message}
                    />
                </div>
            )}
        />
    );
}

// ============================================
// FormTextarea Component
// ============================================

interface FormTextareaProps {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    label: React.ReactNode;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    className?: string;
}

export function FormTextarea({
    name,
    control,
    label,
    placeholder,
    rows = 4,
    disabled = false,
    className = '',
}: FormTextareaProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className={className}>
                    <Label htmlFor={name} className="block mb-2">
                        {label}
                    </Label>
                    <Textarea
                        {...field}
                        id={name}
                        rows={rows}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={error ? 'border-destructive' : ''}
                    />
                    {error && (
                        <p className="mt-1.5 text-sm text-destructive">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
}

// ============================================
// FormCheckbox Component
// ============================================

interface FormCheckboxProps {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    label: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

export function FormCheckbox({
    name,
    control,
    label,
    disabled = false,
    className = '',
}: FormCheckboxProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                <div className={className}>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            {...field}
                            id={name}
                            checked={!!value}
                            onCheckedChange={onChange}
                            disabled={disabled}
                        />
                        <Label
                            htmlFor={name}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            {label}
                        </Label>
                    </div>
                    {error && (
                        <p className="mt-1.5 text-sm text-destructive">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
}

// ============================================
// FormFileUpload Component (for images)
// ============================================

interface FormFileUploadProps {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    label: React.ReactNode;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    disabled?: boolean;
    className?: string;
}

export function FormFileUpload({
    name,
    control,
    label,
    accept = 'image/*',
    multiple = true,
    maxSize = 5,
    disabled = false,
    className = '',
}: FormFileUploadProps) {
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange: (value: (File | string)[]) => void,
        currentValue: (File | string)[]
    ) => {
        const files = Array.from(e.target.files || []);

        // Validate file size
        const validFiles = files.filter(file => {
            if (file.size > maxSize * 1024 * 1024) {
                alert(`${file.name} is too large. Maximum size is ${maxSize}MB.`);
                return false;
            }
            return true;
        });

        // Merge new files with existing files (preserve both new Files and existing URLs)
        const existingFiles = Array.isArray(currentValue) ? currentValue : [];
        const newFiles = [...existingFiles, ...validFiles];
        onChange(newFiles);
    };

    const handleRemoveImage = (
        index: number,
        onChange: (value: (File | string)[]) => void,
        currentValue: (File | string)[]
    ) => {
        const newFiles = currentValue.filter((_, i) => i !== index);
        onChange(newFiles);
    };

    // Helper to get image source (handle both File and URL string)
    const getImageSrc = (item: File | string): string => {
        if (typeof item === 'string') {
            // It's a URL from the server
            return item.startsWith('http') ? item : `http://197.243.0.108:5003${item}`;
        }
        // It's a File object
        return URL.createObjectURL(item);
    };

    // Helper to get file name
    const getFileName = (item: File | string, index: number): string => {
        if (typeof item === 'string') {
            return `Image ${index + 1}`;
        }
        return item.name;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value = [], onChange }, fieldState: { error } }) => (
                <div className={className}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>

                    {/* Upload Area */}
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <input
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            disabled={disabled}
                            onChange={(e) => handleFileChange(e, onChange, value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label={typeof label === 'string' ? label : 'File upload'}
                        />
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-lg font-medium text-gray-900">
                                    Click or drag & drop to upload
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Maximum file size: {maxSize}MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Thumbnails */}
                    <div className="mt-4">
                        {value.length > 0 && (
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-gray-700">
                                    {value.length} file{value.length > 1 ? 's' : ''} selected
                                </p>
                            </div>
                        )}
                        <div className="grid grid-cols-5 gap-4">
                            {value.length > 0 ? (
                                <>
                                    {value.slice(0, 5).map((item: File | string, index: number) => {
                                        const src = getImageSrc(item);
                                        const fileName = getFileName(item, index);
                                        const isFile = item instanceof File;

                                        return (
                                            <div key={index} className="relative group">
                                                <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={src}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onLoad={(e) => {
                                                            // Only revoke object URL for File objects
                                                            if (isFile) {
                                                                URL.revokeObjectURL((e.target as HTMLImageElement).src);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index, onChange, value)}
                                                    disabled={disabled}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={`Remove file ${index + 1}`}
                                                >
                                                    ×
                                                </button>
                                                <p className="text-xs text-gray-500 mt-1 truncate">{fileName}</p>
                                            </div>
                                        );
                                    })}

                                    {/* Show "+X more" if there are more than 5 files */}
                                    {value.length > 5 && (
                                        <div className="relative">
                                            <div className="w-full h-24 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-600">+{value.length - 5}</div>
                                                    <div className="text-xs text-gray-500">more</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Show placeholder thumbnails when no files are uploaded
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                        <div className="text-gray-400 text-xs">No file</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {error && (
                        <p className="mt-2 text-sm text-destructive">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
}// ============================================
// FormError Component (for form-level errors)
// ============================================

interface FormErrorProps {
    error?: FieldError | { message: string };
    className?: string;
}

export function FormError({ error, className = '' }: FormErrorProps) {
    if (!error) return null;

    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error.message}</p>
            </div>
        </div>
    );
}
