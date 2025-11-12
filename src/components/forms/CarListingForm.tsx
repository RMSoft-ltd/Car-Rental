/**
 * Multi-step Car Listing Form Component
 * Handles both CREATE and UPDATE modes
 * Integrates with React Hook Form and Zod validation
 */

'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    listingInformationSchema,
    featuresSchema,
    priceSchema,
    infoSchema,
    imagesSchema,
    defaultListingInformation,
    defaultFeatures,
    defaultPrice,
    defaultInfo,
    defaultImages,
    type ListingInformationFormData,
    type FeaturesFormData,
    type PriceFormData,
    type InfoFormData,
    type ImagesFormData,
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
import { CAR_MAKES, CAR_MODELS, FUEL_TYPES, TRANSMISSION_TYPES, DRIVER_TYPES, CAR_COLORS, BODY_TYPES, FUEL_POLICIES, CUSTOM_DAYS } from '@/constants/car-listing';
import Button from '../shared/Button';
import { X } from 'lucide-react';

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

type StepData = any; // Union of all step types

// ============================================
// Form Steps Configuration
// ============================================

const STEPS = [
    { id: 0, title: 'Listing Information', description: 'Basic details about your car' },
    { id: 1, title: 'Features', description: 'Select available features' },
    { id: 2, title: 'Pricing', description: 'Set your rental price' },
    { id: 3, title: 'Important Info', description: 'Requirements and policies' },
    { id: 4, title: 'Images', description: 'Upload car photos' },
];

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
    const [formData, setFormData] = useState<Partial<CarListingFormData>>({
        ...defaultListingInformation,
        ...defaultFeatures,
        ...defaultPrice,
        ...defaultInfo,
        ...defaultImages,
        ...initialData,
    });

    console.log(`Initial data: ${JSON.stringify(initialData)}`);

    // Get the current step's schema
    const getStepSchema = (step: number) => {
        switch (step) {
            case 0:
                return listingInformationSchema;
            case 1:
                return featuresSchema;
            case 2:
                return priceSchema;
            case 3:
                return infoSchema;
            case 4:
                return imagesSchema;
            default:
                return listingInformationSchema;
        }
    };

    // Get the current step's default values
    const getStepDefaultValues = (step: number): StepData => {
        const allData = {
            ...defaultListingInformation,
            ...defaultFeatures,
            ...defaultPrice,
            ...defaultInfo,
            ...defaultImages,
            ...formData,
        };

        switch (step) {
            case 0:
                return {
                    title: allData.title,
                    make: allData.make,
                    model: allData.model,
                    plateNumber: allData.plateNumber,
                    body: allData.body,
                    seats: allData.seats,
                    year: allData.year,
                    mileage: allData.mileage,
                    fuelType: allData.fuelType,
                    transition: allData.transition,
                    driverType: allData.driverType,
                    engineSize: allData.engineSize,
                    doors: allData.doors,
                    smallBags: allData.smallBags,
                    color: allData.color,
                    largeBags: allData.largeBags,
                    inTerminal: allData.inTerminal,
                    description: allData.description,
                } as ListingInformationFormData;
            case 1:
                return {
                    isPowerSteering: allData.isPowerSteering,
                    isCruiseControl: allData.isCruiseControl,
                    isNavigation: allData.isNavigation,
                    isPowerLocks: allData.isPowerLocks,
                    isVanityMirror: allData.isVanityMirror,
                    isTrunkLight: allData.isTrunkLight,
                    isAirConditioner: allData.isAirConditioner,
                    Techometer: allData.Techometer,
                    isDigitalOdometer: allData.isDigitalOdometer,
                    isLeatherSeats: allData.isLeatherSeats,
                    isHeater: allData.isHeater,
                    isMemorySeats: allData.isMemorySeats,
                    isFogLightsFront: allData.isFogLightsFront,
                    isRainSensingWipe: allData.isRainSensingWipe,
                    isRearSpoiler: allData.isRearSpoiler,
                    isSunRoof: allData.isSunRoof,
                    isRearWindow: allData.isRearWindow,
                    isWindowDefroster: allData.isWindowDefroster,
                    isBreakeAssist: allData.isBreakeAssist,
                    isChildSafetyLocks: allData.isChildSafetyLocks,
                    isTractionControl: allData.isTractionControl,
                    isPowerDoorLocks: allData.isPowerDoorLocks,
                    isDriverAirBag: allData.isDriverAirBag,
                    isAntiLockBreaks: allData.isAntiLockBreaks,
                } as FeaturesFormData;
            case 2:
                return {
                    pricePerDay: allData.pricePerDay,
                    currency: allData.currency,
                } as PriceFormData;
            case 3:
                const step3Data: any = {
                    requiredDocs: allData.requiredDocs,
                    securityDeposit: allData.securityDeposit,
                    securityDepositAmount: allData.securityDepositAmount,
                    damageExcess: allData.damageExcess,
                    fuelPolicy: allData.fuelPolicy,
                    insuranceExpirationDate: allData.insuranceExpirationDate,
                    insuranceFile: allData.insuranceFile,
                    availabilityType: allData.availabilityType,
                    customDays: allData.customDays,
                };
                
                // Populate individual checkboxes from customDays array
                if (Array.isArray(allData.customDays) && allData.customDays.length > 0) {
                    CUSTOM_DAYS.forEach((day) => {
                        step3Data[`customDay_${day}`] = allData.customDays!.includes(day);
                    });
                }
                
                return step3Data as InfoFormData;
            case 4:
                return {
                    carImages: allData.carImages,
                } as ImagesFormData;
            default:
                return {} as StepData;
        }
    };

    // Initialize form with current step's schema and data
    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
    } = useForm<StepData>({
        resolver: zodResolver(getStepSchema(currentStep)),
        defaultValues: getStepDefaultValues(currentStep),
        mode: 'onChange',
    });

    // Handle next step
    const handleNext = async () => {
        const isValid = await trigger();

        if (isValid) {
            // Save current step data
            const stepData = getValues();
            
            // Collect custom days if we're on the Important Info step
            if (currentStep === 3 && stepData.availabilityType === 'CUSTOM') {
                const customDays: string[] = [];
                CUSTOM_DAYS.forEach((day) => {
                    const checkboxKey = `customDay_${day}`;
                    if (stepData[checkboxKey]) {
                        customDays.push(day);
                    }
                });
                stepData.customDays = customDays;
            }
            
            setFormData((prev) => ({ ...prev, ...stepData }));

            // Move to next step
            if (currentStep < STEPS.length - 1) {
                setCurrentStep((prev) => prev + 1);
            }
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        // Save current step data
        const stepData = getValues();
        setFormData((prev) => ({ ...prev, ...stepData }));

        // Move to previous step
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Handle final form submission
    const handleFormSubmit = handleSubmit(async (data) => {
        // Combine all step data
        const completeData = {
            ...formData,
            ...data,
        } as any;

        // Collect custom days from individual checkboxes
        if (completeData.availabilityType === 'CUSTOM') {
            const customDays: string[] = [];
            CUSTOM_DAYS.forEach((day) => {
                const checkboxKey = `customDay_${day}`;
                if (completeData[checkboxKey]) {
                    customDays.push(day);
                }
                // Remove the individual checkbox field
                delete completeData[checkboxKey];
            });
            completeData.customDays = customDays;
        } else {
            // Clear customDays if not CUSTOM availability type
            completeData.customDays = undefined;
        }

        await onSubmit(completeData as CarListingFormData);
    });

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Progress Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {STEPS.map((step, index) => (
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
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`h-1 flex-1 mx-2 -mt-5 transition-colors ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Available Days
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {CUSTOM_DAYS.map((day) => (
                                    <FormCheckbox
                                        key={day}
                                        name={`customDay_${day}`}
                                        control={control}
                                        label={day === 'Mon' ? 'Monday' :
                                            day === 'Tue' ? 'Tuesday' :
                                                day === 'Wen' ? 'Wednesday' :
                                                    day === 'Thur' ? 'Thursday' :
                                                        day === 'Fri' ? 'Friday' :
                                                            day === 'Sat' ? 'Saturday' :
                                                                'Sunday'}
                                    />
                                ))}
                            </div>
                        </div>
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
