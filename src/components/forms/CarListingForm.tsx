/**
 * Multi-step Car Listing Form Component
 * Handles both CREATE and UPDATE modes
 * Integrates with React Hook Form and Zod validation
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    carListingSchema,
    defaultCarListingData,
    type CarListingFormData,
} from '@/schemas/car-listing.schema';
import {
    FormInput,
    FormSelect,
    FormCombobox,
    FormTextarea,
    FormCheckbox,
    FormFileUpload,
    FormError,
} from './FormComponents';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CAR_MAKES, CAR_MODELS, FUEL_TYPES, TRANSMISSION_TYPES, DRIVER_TYPES, CAR_COLORS, BODY_TYPES, FUEL_POLICIES, CUSTOM_DAYS } from '@/constants/car-listing';
import Button from '../shared/Button';

// ============================================
// Types
// ============================================

type FormMode = 'create' | 'update';

interface CarListingFormProps {
    mode?: FormMode;
    initialData?: Partial<CarListingFormData>;
    onSubmit: (data: CarListingFormData) => Promise<void>;
    onCancel?: () => void;
    isSubmitting?: boolean;
}

// ============================================
// Form Steps Configuration
// ============================================

const STEPS = [
    { id: 0, title: 'Listing Information', description: 'Basic details about your car' },
    { id: 1, title: 'Features', description: 'Select available features' },
    { id: 2, title: 'Pricing', description: 'Set your rental price' },
    { id: 3, title: 'Important Info', description: 'Requirements and policies' },
    { id: 4, title: 'Images', description: 'Upload car photos' },
] as const;

// Day labels mapping
const DAY_LABELS: Record<string, string> = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wen: 'Wednesday',
    Thur: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday',
};

// Helper function to transform customDays array to checkbox fields
// NOTE: We keep this for backward compatibility but won't use checkbox fields in form state
const transformCustomDaysToCheckboxes = (data: Partial<CarListingFormData>) => {
    // Just return data as-is, we'll handle checkboxes differently
    return { ...data };
};

// Helper function to check if a day is selected
const isDaySelected = (customDays: string[] | undefined, day: string): boolean => {
    return Array.isArray(customDays) && customDays.includes(day);
};

// Fields to validate for each step
const getStepFields = (step: number): (keyof CarListingFormData)[] => {
    switch (step) {
        case 0:
            return ['title', 'make', 'model', 'plateNumber', 'body', 'seats', 'year', 'mileage',
                'fuelType', 'transition', 'driverType', 'engineSize', 'doors', 'smallBags',
                'color', 'largeBags', 'inTerminal', 'description'];
        case 1:
            return ['isPowerSteering', 'isCruiseControl', 'isNavigation', 'isPowerLocks',
                'isVanityMirror', 'isTrunkLight', 'isAirConditioner', 'Techometer',
                'isDigitalOdometer', 'isLeatherSeats', 'isHeater', 'isMemorySeats',
                'isFogLightsFront', 'isRainSensingWipe', 'isRearSpoiler', 'isSunRoof',
                'isRearWindow', 'isWindowDefroster', 'isBreakeAssist', 'isChildSafetyLocks',
                'isTractionControl', 'isPowerDoorLocks', 'isDriverAirBag', 'isAntiLockBreaks'];
        case 2:
            return ['pricePerDay', 'currency'];
        case 3:
            return ['requiredDocs', 'securityDeposit', 'securityDepositAmount', 'damageExcess',
                'fuelPolicy', 'insuranceExpirationDate', 'insuranceFile', 'availabilityType', 'customDays'];
        case 4:
            return ['carImages'];
        default:
            return [];
    }
};

// ============================================
// CarListingForm Component
// ============================================

export function CarListingForm({
    mode = 'create',
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: CarListingFormProps) {
    const [currentStep, setCurrentStep] = useState(0);

    // Initialize form with complete schema and all default values
    const defaultValues = useMemo(() => {
        const baseData = {
            ...defaultCarListingData,
            ...initialData,
        };
        return transformCustomDaysToCheckboxes(baseData);
    }, [initialData]);

    const form = useForm<CarListingFormData>({
        resolver: zodResolver(carListingSchema) as any,
        defaultValues,
        mode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
        getValues,
        reset,
    } = form;

    // Reset form when initialData changes (important for edit mode)
    useEffect(() => {
        if (initialData) {
            const transformedData = transformCustomDaysToCheckboxes({
                ...defaultCarListingData,
                ...initialData,
            });
            reset(transformedData);
        }
    }, [initialData, reset]);

    // Validate current step fields
    const validateStep = async (): Promise<boolean> => {
        const stepFields = getStepFields(currentStep);

        return await trigger(stepFields as any);
    };

    // Handle next step
    const handleNext = async (e?: React.MouseEvent) => {
        e?.preventDefault();

        const isValid = await validateStep();
        if (isValid && currentStep < STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Handle final form submission
    const handleFormSubmit = handleSubmit(async (data) => {
        const submitData = { ...data } as any;

        // Debug: Log the data before transformation
        console.log('Form data before submission:', data);
        console.log('availabilityType:', submitData.availabilityType);
        console.log('customDays from form:', submitData.customDays);

        // Ensure customDays is an empty array if not CUSTOM
        if (submitData.availabilityType !== 'CUSTOM') {
            submitData.customDays = [];
        }

        console.log('Final submit data:', submitData);
        console.log('customDays in final data:', submitData.customDays);

        await onSubmit(submitData as CarListingFormData);
    });

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <div className="max-w-5xl mx-auto">
            <ProgressStepper steps={STEPS} currentStep={currentStep} />

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{STEPS[currentStep].title}</h2>
                    <p className="text-gray-600 mt-1">{STEPS[currentStep].description}</p>
                </div>

                <form onSubmit={handleFormSubmit}>
                    {/* Step 0: Listing Information */}
                    {currentStep === 0 && <ListingInformationStep control={control} />}

                    {/* Step 1: Features */}
                    {currentStep === 1 && <FeaturesStep control={control} />}

                    {/* Step 2: Pricing */}
                    {currentStep === 2 && <PricingStep control={control} />}

                    {/* Step 3: Important Info */}
                    {currentStep === 3 && <ImportantInfoStep control={control} />}

                    {/* Step 4: Images */}
                    {currentStep === 4 && <ImagesStep control={control} />}

                    {/* Form-level errors */}
                    {errors.root && <FormError error={errors.root as any} className="mt-6" />}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <div>
                            {!isFirstStep && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type='button'
                                    onClick={handlePrevious}
                                    disabled={isSubmitting}
                                >
                                    Previous
                                </Button>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            {onCancel && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type='button'
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            )}
                            {!isLastStep ? (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    type='button'
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    type='submit'
                                    disabled={isSubmitting}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Listing' : 'Update Listing'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ============================================
// Progress Stepper Component
// ============================================

interface ProgressStepperProps {
    steps: typeof STEPS;
    currentStep: number;
}

function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center flex-1">
                            {/* Step Circle */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${index < currentStep
                                    ? 'bg-green-500 text-white text-xs'
                                    : index === currentStep
                                        ? 'bg-black text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {index < currentStep ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            {/* Step Title */}
                            <div className="mt-2 text-center">
                                <p
                                    className={`text-xs font-medium ${index === currentStep ? 'text-black' : 'text-gray-600'
                                        }`}
                                >
                                    {step.title}
                                </p>
                            </div>
                        </div>
                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div
                                className={`h-1 flex-1 mx-2 -mt-5 transition-colors ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// Step Components
// ============================================

function ListingInformationStep({ control }: { control: any }) {
    const selectedMake = useWatch({
        control,
        name: 'make',
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    name="title"
                    control={control}
                    label="Listing Title *"
                    placeholder="e.g., Toyota Camry 2020 - Excellent Condition"
                    className="md:col-span-2"
                />

                <FormCombobox
                    name="make"
                    control={control}
                    label="Make *"
                    options={CAR_MAKES.map((make) => ({ value: make, label: make }))}
                    placeholder="Select make"
                    searchPlaceholder="Search make..."
                />

                <FormCombobox
                    name="model"
                    control={control}
                    label="Model *"
                    options={
                        selectedMake && CAR_MODELS[selectedMake as keyof typeof CAR_MODELS]
                            ? CAR_MODELS[selectedMake as keyof typeof CAR_MODELS].map((model) => ({
                                value: model,
                                label: model,
                            }))
                            : []
                    }
                    placeholder="Select model"
                    searchPlaceholder="Search model..."
                    disabled={!selectedMake}
                />

                <FormInput name="plateNumber" control={control} label="Plate Number *" placeholder="e.g., RAB1234" />

                <FormSelect
                    name="body"
                    control={control}
                    label="Body Type"
                    options={BODY_TYPES.map((body) => ({ value: body, label: body }))}
                />

                <FormInput name="seats" control={control} label="Number of Seats *" type="number" placeholder="e.g., 5" />

                <FormInput name="year" control={control} label="Year *" type="number" placeholder="e.g., 2020" />

                <FormInput name="mileage" control={control} label="Mileage (km)" type="number" placeholder="e.g., 45000" />

                <FormSelect
                    name="fuelType"
                    control={control}
                    label="Fuel Type"
                    options={FUEL_TYPES.map((fuel) => ({ value: fuel, label: fuel }))}
                />

                <FormSelect
                    name="transition"
                    control={control}
                    label="Transmission"
                    options={TRANSMISSION_TYPES.map((trans) => ({ value: trans, label: trans }))}
                />

                <FormSelect
                    name="driverType"
                    control={control}
                    label="Driver Type"
                    options={DRIVER_TYPES.map((driver) => ({ value: driver, label: driver }))}
                />

                <FormInput
                    name="engineSize"
                    control={control}
                    label="Engine Size (L)"
                    type="number"
                    placeholder="e.g., 2.0"
                />

                <FormInput name="doors" control={control} label="Number of Doors" type="number" placeholder="e.g., 4" />

                <FormInput name="smallBags" control={control} label="Small Bags Capacity" type="number" placeholder="e.g., 2" />

                <FormCombobox
                    name="color"
                    control={control}
                    label="Color"
                    options={CAR_COLORS.map((color) => ({ value: color, label: color }))}
                    placeholder="Select color"
                    searchPlaceholder="Search color..."
                />

                <FormInput name="largeBags" control={control} label="Large Bags Capacity" type="number" placeholder="e.g., 2" />

                <FormInput name="inTerminal" control={control} label="Terminal Location" placeholder="e.g., Kigali Airport Terminal 1" />
            </div>

            <FormTextarea
                name="description"
                control={control}
                label="Description"
                rows={6}
                placeholder="Provide a detailed description of the car..."
            />
        </div>
    );
}

function FeaturesStep({ control }: { control: any }) {
    return (
        <div className="space-y-8">
            {/* Comfort Features */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comfort Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormCheckbox name="isPowerSteering" control={control} label="Power Steering" />
                    <FormCheckbox name="isCruiseControl" control={control} label="Cruise Control" />
                    <FormCheckbox name="isNavigation" control={control} label="Navigation System" />
                    <FormCheckbox name="isPowerLocks" control={control} label="Power Locks" />
                    <FormCheckbox name="isVanityMirror" control={control} label="Vanity Mirror" />
                    <FormCheckbox name="isTrunkLight" control={control} label="Trunk Light" />
                </div>
            </div>

            {/* Interior Features */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interior Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormCheckbox name="isAirConditioner" control={control} label="Air Conditioner" />
                    <FormCheckbox name="Techometer" control={control} label="Tachometer" />
                    <FormCheckbox name="isDigitalOdometer" control={control} label="Digital Odometer" />
                    <FormCheckbox name="isLeatherSeats" control={control} label="Leather Seats" />
                    <FormCheckbox name="isHeater" control={control} label="Heater" />
                    <FormCheckbox name="isMemorySeats" control={control} label="Memory Seats" />
                </div>
            </div>

            {/* Exterior Features */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exterior Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormCheckbox name="isFogLightsFront" control={control} label="Fog Lights (Front)" />
                    <FormCheckbox name="isRainSensingWipe" control={control} label="Rain Sensing Wipers" />
                    <FormCheckbox name="isRearSpoiler" control={control} label="Rear Spoiler" />
                    <FormCheckbox name="isSunRoof" control={control} label="Sunroof" />
                    <FormCheckbox name="isRearWindow" control={control} label="Rear Window Wiper" />
                    <FormCheckbox name="isWindowDefroster" control={control} label="Window Defroster" />
                </div>
            </div>

            {/* Safety Features */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormCheckbox name="isBreakeAssist" control={control} label="Brake Assist" />
                    <FormCheckbox name="isChildSafetyLocks" control={control} label="Child Safety Locks" />
                    <FormCheckbox name="isTractionControl" control={control} label="Traction Control" />
                    <FormCheckbox name="isPowerDoorLocks" control={control} label="Power Door Locks" />
                    <FormCheckbox name="isDriverAirBag" control={control} label="Driver Airbag" />
                    <FormCheckbox name="isAntiLockBreaks" control={control} label="Anti-lock Brakes (ABS)" />
                </div>
            </div>
        </div>
    );
}

function PricingStep({ control }: { control: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    name="pricePerDay"
                    control={control}
                    label="Price Per Day"
                    placeholder="e.g., 50,000"
                    type='number'
                />

                <FormSelect
                    name="currency"
                    control={control}
                    label="Currency"
                    options={[
                        { value: 'RWF', label: 'RWF (Rwandan Franc)' },
                        { value: 'USD', label: 'USD (US Dollar)' },
                        { value: 'EUR', label: 'EUR (Euro)' },
                        { value: 'NGN', label: 'NGN (Nigerian Naira)' },
                    ]}
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Research similar vehicles in your area to set a competitive price. Consider
                    the car's age, condition, and features when determining your rental rate.
                </p>
            </div>
        </div>
    );
}

function ImportantInfoStep({ control }: { control: any }) {
    const availabilityType = useWatch({
        control,
        name: 'availabilityType',
    });

    const customDays = useWatch({
        control,
        name: 'customDays',
    });

    return (
        <div className="space-y-6">
            <FormTextarea
                name="requiredDocs"
                control={control}
                label="Required Documents"
                rows={6}
                placeholder="List the documents renters need to provide (e.g., Valid driver's license, National ID, etc.)"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    name="securityDeposit"
                    control={control}
                    label="Security Deposit"
                    placeholder="e.g., 50000 RWF"
                    type='number'
                />

                <FormInput
                    name="securityDepositAmount"
                    control={control}
                    label="Security Deposit Amount"
                    type="number"
                    placeholder="e.g., 200000"
                />

                <FormInput
                    name="damageExcess"
                    control={control}
                    label="Damage Excess"
                    placeholder="e.g., 100000 RWF"
                    type='number'
                />

                <FormSelect
                    name="fuelPolicy"
                    control={control}
                    label="Fuel Policy"
                    options={FUEL_POLICIES.map((policy) => ({ value: policy, label: policy }))}
                />
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            name="insuranceExpirationDate"
                            control={control}
                            label="Insurance Expiration Date"
                            type="date"
                            placeholder="YYYY-MM-DD"
                        />

                        <FormInput
                            name="insuranceFile"
                            control={control}
                            label="Insurance File"
                            type="file"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-6">
                    <FormSelect
                        name="availabilityType"
                        control={control}
                        label="Availability Type"
                        options={[
                            { value: 'FULL', label: 'Full Time (24/7)' },
                            { value: 'WEEKDAYS', label: 'Weekdays Only' },
                            { value: 'WEEKENDS', label: 'Weekends Only' },
                            { value: 'CUSTOM', label: 'Custom Days' },
                        ]}
                    />

                    {availabilityType === 'CUSTOM' && (
                        <Controller
                            name="customDays"
                            control={control}
                            render={({ field: { value = [], onChange }, fieldState: { error } }) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select Available Days
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {CUSTOM_DAYS.map((day) => {
                                            const isChecked = isDaySelected(value as string[], day);

                                            return (
                                                <div key={day} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`customDay_${day}`}
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            const currentDays = Array.isArray(value) ? value : [];
                                                            if (checked) {
                                                                // Add day if not already present
                                                                if (!currentDays.includes(day)) {
                                                                    onChange([...currentDays, day]);
                                                                }
                                                            } else {
                                                                // Remove day
                                                                onChange(currentDays.filter((d: string) => d !== day));
                                                            }
                                                        }}
                                                    />
                                                    <Label
                                                        htmlFor={`customDay_${day}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {DAY_LABELS[day] || day}
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {error && (
                                        <p className="mt-2 text-sm text-destructive">{error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    )}


                </div>
            </div>
        </div>
    );
}

function ImagesStep({ control }: { control: any }) {
    return (
        <div className="space-y-6">
            <FormFileUpload
                name="carImages"
                control={control}
                label="Car Images"
                accept="image/*"
                multiple={true}
                maxSize={3}
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Upload clear, high-quality images of your car. Include photos from
                    different angles (front, back, sides, interior). Good photos significantly increase your chances
                    of getting bookings.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                    <strong>Tips for great photos:</strong>
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Take photos in good lighting (natural light works best)</li>
                    <li>Clean your car before photographing</li>
                    <li>Include at least 5-8 photos from different angles</li>
                    <li>Show both exterior and interior details</li>
                    <li>Highlight any special features or unique aspects</li>
                </ul>
            </div>
        </div>
    );
}
