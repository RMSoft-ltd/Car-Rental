'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useWatch, Controller, type Control } from 'react-hook-form';
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
    FormCheckbox,
    FormFileUpload,
    FormError,
} from './FormComponents';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CAR_MAKES, CAR_MODELS, FUEL_TYPES, TRANSMISSION_TYPES, DRIVER_TYPES, CAR_COLORS, BODY_TYPES, FUEL_POLICIES, CUSTOM_DAYS } from '@/constants/car-listing';
import Button from '../shared/Button';
import { Asterisk } from 'lucide-react';
import TiptapEditor from '../shared/TiptapEditor';
import LocationPicker from '../shared/LocationPicker';

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
    { id: 0, title: 'Basic Information', description: 'Basic details about your car' },
    { id: 1, title: 'Features', description: 'Select available features' },
    { id: 2, title: 'Pricing', description: 'Set your rental price' },
    { id: 3, title: 'Important Information', description: 'Requirements and policies' },
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

const transformCustomDaysToCheckboxes = (data: Partial<CarListingFormData>) => {
    return {
        ...data,
        // Ensure customDays is always an array
        customDays: Array.isArray(data.customDays) ? data.customDays : [],
    };
};

const isDaySelected = (customDays: string[] | undefined, day: string): boolean => {
    return Array.isArray(customDays) && customDays.includes(day);
};

const getStepFields = (step: number): (keyof CarListingFormData)[] => {
    switch (step) {
        case 0:
            return ['title', 'make', 'model', 'plateNumber', 'body', 'seats', 'year', 'mileage',
                'fuelType', 'transition', 'driverType', 'engineSize', 'doors', 'smallBags',
                'color', 'largeBags', 'description'];
        case 1:
            return ['isPowerSteering', 'isCruiseControl', 'isNavigation', 'isPowerLocks',
                'isVanityMirror', 'isTrunkLight', 'isAirConditioner',
                'isLeatherSeats', 'isMemorySeats',
                'isHeatedSeatEquipped', 'isRadioEquipped', 'isRadioBluetoothEnabled', 'isKeyLess',
                'isFogLightsFront', 'isRainSensingWipe', 'isRearSpoiler', 'isSunRoof',
                'isRearWindow', 'isBreakeAssist', 'isChildSafetyLocks',
                'isTractionControl', 'isPowerDoorLocks', 'isDriverAirBag', 'isAntiLockBreaks',
                'isAirbagEquipped', 'isBackCameraEquipped', 'isSpareTireIncluded',
                'isJackIncluded', 'isWheelSpannerIncluded', 'isRightHandDrive', 'isLeftHandDrive'];
        case 2:
            return ['pricePerDay', 'currency'];
        case 3:
            return ['requiredDocs', 'securityDeposit', 'securityDepositAmount',
                'fuelPolicy', 'returningConditions', 'pickUpLocation', 'availabilityType', 'customDays'];
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

    const defaultValues = useMemo(() => {
        const baseData = {
            ...defaultCarListingData,
            ...initialData,
        };
        return transformCustomDaysToCheckboxes(baseData);
    }, [initialData]);

    const form = useForm<CarListingFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(carListingSchema) as any,
        defaultValues,
        mode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        reset,
    } = form;

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (initialData) {
            const transformedData = transformCustomDaysToCheckboxes({
                ...defaultCarListingData,
                ...initialData,
            });
            reset(transformedData);
            setIsInitialized(true);
        }
    }, [initialData, reset]);

    // Watch for availabilityType changes and clear customDays when not CUSTOM
    const availabilityType = useWatch({
        control,
        name: 'availabilityType',
    });

    useEffect(() => {
        // Only handle availabilityType changes after initial load
        if (!isInitialized) return;

        if (availabilityType) {
            if (availabilityType !== 'CUSTOM') {
                form.setValue('customDays', []);
            } else {
                // Ensure customDays is an array when switching to CUSTOM
                const currentCustomDays = form.getValues('customDays');
                if (!Array.isArray(currentCustomDays)) {
                    form.setValue('customDays', []);
                }
            }
        }
    }, [availabilityType, form, isInitialized]);

    // Validate current step fields
    const validateStep = async (): Promise<boolean> => {
        const stepFields = getStepFields(currentStep);

        return await trigger(stepFields);
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
    const handleFormSubmit = handleSubmit(async (data: CarListingFormData) => {
        const submitData: CarListingFormData = { ...data };

        if (submitData.availabilityType !== 'CUSTOM') {
            submitData.customDays = [];
        }

        await onSubmit(submitData);
    });

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <div className="container mx-auto max-w-7xl">
            <ProgressStepper steps={STEPS} currentStep={currentStep} />

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-md p-8 w-full">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{STEPS[currentStep].title}</h2>
                    <p className="text-gray-600 mt-1">{STEPS[currentStep].description}</p>
                </div>

                <form onSubmit={handleFormSubmit} className="w-full">

                    {currentStep === 0 && <ListingInformationStep control={control} />}

                    {currentStep === 1 && <FeaturesStep control={control} />}

                    {currentStep === 2 && <PricingStep control={control} />}

                    {currentStep === 3 && <ImportantInfoStep control={control} form={form} />}

                    {currentStep === 4 && <ImagesStep control={control} />}

                    {errors.root?.message && (
                        <FormError
                            error={{ message: errors.root.message }}
                            className="mt-6"
                        />
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t pb-0">
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
        <div className="mb-4 lg:mb-6">
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ListingInformationStep({ control }: { control: Control<any> }) {
    const selectedMake = useWatch({
        control,
        name: 'make',
    });

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    name="title"
                    control={control}
                    label={<div className='flex items-center'>Listing Title <Asterisk size={14} className='text-destructive' /></div>}
                    placeholder="e.g., Toyota Camry 2020 - Excellent Condition"
                    className="md:col-span-2"
                />

                <FormCombobox
                    name="make"
                    control={control}
                    label={<div className='flex items-center'>Make <Asterisk size={14} className='text-destructive' /></div>}
                    options={CAR_MAKES.map((make) => ({ value: make, label: make }))}
                    placeholder="Select make"
                    searchPlaceholder="Search make..."
                />

                <FormCombobox
                    name="model"
                    control={control}
                    label={<div className='flex items-center'>Model <Asterisk size={14} className='text-destructive' /></div>}
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
                    allowCustomValue={true}
                />

                <FormInput
                    name="plateNumber"
                    control={control}
                    label={<div className='flex items-center'>Plate Number <Asterisk size={14} className='text-destructive' /></div>}
                    placeholder="e.g., RAB1234"
                />

                <FormInput name="year" control={control} label={<div className='flex items-center'>Year <Asterisk size={14} className='text-destructive' /></div>} type="number" placeholder="e.g., 2020" />

                <FormInput name="seats" control={control} label={<div className='flex items-center'>Number of Seats <Asterisk size={14} className='text-destructive' /></div>} type="number" placeholder="e.g., 5" />

                <FormSelect
                    name="body"
                    control={control}
                    label={<div className='flex items-center'>Body Type <Asterisk size={14} className='text-destructive' /></div>}
                    options={BODY_TYPES.map((body) => ({ value: body, label: body }))}
                />

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
            </div>

            <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <TiptapEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Enter detailed description of your car"
                        />
                        {error && (
                            <p className="text-sm text-destructive">{error.message}</p>
                        )}
                    </div>
                )}
            />

        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FeaturesStep({ control }: { control: Control<any> }) {
    return (
        <div className="w-full space-y-4 lg:space-y-6">
            {/* Comfort Features */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Comfort Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Interior Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormCheckbox name="isAirConditioner" control={control} label="Air Conditioner" />
                    <FormCheckbox name="isLeatherSeats" control={control} label="Leather Seats" />
                    <FormCheckbox name="isMemorySeats" control={control} label="Memory Seats" />
                    <FormCheckbox name="isHeatedSeatEquipped" control={control} label="Heated Seats" />
                    <FormCheckbox name="isRadioEquipped" control={control} label="Radio Equipped" />
                    <FormCheckbox name="isRadioBluetoothEnabled" control={control} label="Bluetooth Radio" />
                    <FormCheckbox name="isKeyLess" control={control} label="Keyless Entry" />
                </div>
            </div>

            {/* Exterior Features */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Exterior Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormCheckbox name="isFogLightsFront" control={control} label="Fog Lights (Front)" />
                    <FormCheckbox name="isRainSensingWipe" control={control} label="Rain Sensing Wipers" />
                    <FormCheckbox name="isRearSpoiler" control={control} label="Rear Spoiler" />
                    <FormCheckbox name="isSunRoof" control={control} label="Sunroof" />
                    <FormCheckbox name="isRearWindow" control={control} label="Rear Window Wiper" />
                </div>
            </div>

            {/* Safety Features */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormCheckbox name="isBreakeAssist" control={control} label="Brake Assist" />
                    <FormCheckbox name="isChildSafetyLocks" control={control} label="Child Safety Locks" />
                    <FormCheckbox name="isTractionControl" control={control} label="Traction Control" />
                    <FormCheckbox name="isPowerDoorLocks" control={control} label="Power Door Locks" />
                    <FormCheckbox name="isDriverAirBag" control={control} label="Driver Airbag" />
                    <FormCheckbox name="isAntiLockBreaks" control={control} label="Anti-lock Brakes (ABS)" />
                    <FormCheckbox name="isAirbagEquipped" control={control} label="Airbag Equipped" />
                    <FormCheckbox name="isBackCameraEquipped" control={control} label="Backup Camera" />
                </div>
            </div>

            {/* Equipment & Accessories */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment & Accessories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormCheckbox name="isSpareTireIncluded" control={control} label="Spare Tire Included" />
                    <FormCheckbox name="isJackIncluded" control={control} label="Jack Included" />
                    <FormCheckbox name="isWheelSpannerIncluded" control={control} label="Wheel Spanner Included" />
                </div>
            </div>

            {/* Drive Type */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Drive Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormCheckbox name="isRightHandDrive" control={control} label="Right Hand Drive" />
                    <FormCheckbox name="isLeftHandDrive" control={control} label="Left Hand Drive" />
                </div>
            </div>

        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PricingStep({ control }: { control: Control<any> }) {
    const pricePerDay = useWatch({
        control,
        name: 'pricePerDay',
    });

    // Calculate price with 10% fee
    const priceFee = pricePerDay ? Number(pricePerDay) * 0.1 : null;
    const priceWithFee = priceFee ? Number(pricePerDay) + Number(priceFee) : null;

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    name="pricePerDay"
                    control={control}
                    label={<div className='flex items-center justify-between w-full'>
                        <span className='flex '>Price Per Day <Asterisk size={14} className='text-destructive' /></span>
                        {priceWithFee && <span className="text-sm text-gray-600">{priceWithFee.toLocaleString()} RWF (incl. 10% System fee)</span>}
                    </div>}
                    placeholder="e.g., 50,000"
                    type='number'
                />

                <Controller
                    name="currency"
                    control={control}
                    defaultValue="RWF"
                    render={({ field }) => (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Currency
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value="RWF (Rwandan Franc)"
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed h-12"
                                    aria-label="Currency"
                                />
                                <input
                                    type="hidden"
                                    {...field}
                                    value="RWF"
                                />
                            </div>
                        </div>
                    )}
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Research similar vehicles in your area to set a competitive price. Consider
                    the car&apos;s age, condition, and features when determining your rental rate.
                </p>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImportantInfoStep({ control, form }: { control: Control<any>; form: any }) {
    const availabilityType = useWatch({
        control,
        name: 'availabilityType',
    });

    return (
        <div className="w-full space-y-4 lg:space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2 lg:space-y-4'>
                <div className="md:col-span-2 space-y-4 lg:space-y-6">
                    <Controller
                        name="requiredDocs"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Important Documents
                                </label>
                                <TiptapEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="List the documents renters need to provide (e.g., Valid driver's license, National ID, etc.)"
                                />
                                {error && (
                                    <p className="text-sm text-destructive">{error.message}</p>
                                )}
                            </div>
                        )}
                    />

                    <FormInput
                        name="securityDepositAmount"
                        control={control}
                        label="Security Deposit Amount"
                        type="number"
                        placeholder="e.g., 200000"
                    />

                    <Controller
                        name="securityDeposit"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Security Deposit Description
                                </label>
                                <TiptapEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="Describe your security deposit terms and conditions..."
                                />
                                {error && (
                                    <p className="text-sm text-destructive">{error.message}</p>
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        name="returningConditions"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Return Condition
                                </label>
                                <TiptapEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="Specify the condition the car should be returned in (e.g., it should be washed, full tank, etc.)"
                                />
                                {error && (
                                    <p className="text-sm text-destructive">{error.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>

                <FormSelect
                    name="fuelPolicy"
                    control={control}
                    label="Fuel Policy"
                    options={FUEL_POLICIES.map((policy) => ({ value: policy, label: policy }))}
                />
            </div>

            <div className="md:col-span-2">
                <Controller
                    name="pickUpLocation"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <LocationPicker
                            value={field.value}
                            onChange={(location, coordinates) => {
                                field.onChange(location);

                                if (coordinates) {
                                    form.setValue('pickUpLocationLatitude', coordinates.lat);
                                    form.setValue('pickUpLocationLongitude', coordinates.lng);
                                } else {
                                    form.setValue('pickUpLocationLatitude', undefined);
                                    form.setValue('pickUpLocationLongitude', undefined);
                                }
                            }}
                            placeholder="Search for pickup location..."
                            error={error?.message}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <div className="space-y-4">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Available Days
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImagesStep({ control }: { control: Control<any> }) {
    return (
        <div className="w-full space-y-4 lg:space-y-6">
            <FormFileUpload
                name="carImages"
                control={control}
                label="Select your car images from your device or drag and drop them here"
                accept="image/*"
                multiple={true}
                maxSize={3}
            />

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
                    <li>Upload clear, high-quality images of your car. Include photos from different angles (front, back, sides, interior). Good photos significantly increase your chances of getting bookings.</li>
                </ul>
            </div>
        </div>
    );
}
