'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationPickerProps {
    value?: string;
    onChange: (location: string, coordinates?: { lat: number; lng: number }) => void;
    placeholder?: string;
    error?: string;
}

interface Coordinates {
    lat: number;
    lng: number;
}

// Global flag to track if Google Maps script is being loaded
let isGoogleMapsLoading = false;
const googleMapsCallbacks: (() => void)[] = [];

// Function to load Google Maps script only once
const loadGoogleMapsScript = (apiKey: string, callback: () => void) => {
    // If already loaded, call callback immediately
    if (window.google?.maps) {
        callback();
        return;
    }

    // If loading, add callback to queue
    if (isGoogleMapsLoading) {
        googleMapsCallbacks.push(callback);
        return;
    }

    // Check if script already exists in the DOM
    const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
        // Script exists, wait for it to load
        isGoogleMapsLoading = true;
        googleMapsCallbacks.push(callback);

        const checkLoaded = setInterval(() => {
            if (window.google?.maps) {
                clearInterval(checkLoaded);
                isGoogleMapsLoading = false;
                callback();
                googleMapsCallbacks.forEach(cb => cb());
                googleMapsCallbacks.length = 0;
            }
        }, 100);
        return;
    }

    // Start loading
    isGoogleMapsLoading = true;
    googleMapsCallbacks.push(callback);

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
        isGoogleMapsLoading = false;
        googleMapsCallbacks.forEach(cb => cb());
        googleMapsCallbacks.length = 0;
    };

    script.onerror = () => {
        console.error('Failed to load Google Maps');
        isGoogleMapsLoading = false;
        googleMapsCallbacks.length = 0;
    };

    document.head.appendChild(script);
};

export default function LocationPicker({
    value = '',
    onChange,
    placeholder = 'Search for a location...',
    error,
}: LocationPickerProps) {
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const [searchInput, setSearchInput] = useState(value);
    const [selectedLocation, setSelectedLocation] = useState<string>(value);
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    // Load Google Maps Script
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_SECRET_KEY;

        if (!apiKey) {
            console.error('Google Maps API key is not configured');
            return;
        }

        loadGoogleMapsScript(apiKey, () => {
            setIsMapLoaded(true);
        });
    }, []);

    // Sync marker ref with state
    useEffect(() => {
        markerRef.current = marker;
    }, [marker]);

    // Define updateMarker callback
    const updateMarker = useCallback((coords: Coordinates) => {
        if (!map) return;

        if (markerRef.current) {
            markerRef.current.setPosition(coords);
        } else {
            const newMarker = new google.maps.Marker({
                position: coords,
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
            });

            setMarker(newMarker);
        }
    }, [map]);

    // Define handleMapClick callback
    const handleMapClick = useCallback((latLng: google.maps.LatLng) => {
        const coords = {
            lat: latLng.lat(),
            lng: latLng.lng(),
        };

        setCoordinates(coords);
        updateMarker(coords);

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                setSelectedLocation(address);
                setSearchInput(address);
                onChange(address, coords);
            }
        });
    }, [onChange, updateMarker]);

    // Initialize Map
    useEffect(() => {
        if (!isMapLoaded || map) return;

        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        // Default to Kigali, Rwanda
        const defaultCenter = { lat: -1.9403, lng: 29.8739 };

        const newMap = new google.maps.Map(mapElement, {
            center: defaultCenter,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        setMap(newMap);

        // Add click listener to map
        newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                handleMapClick(e.latLng);
            }
        });
    }, [isMapLoaded, map, handleMapClick]);

    // Initialize Autocomplete
    useEffect(() => {
        if (!isMapLoaded || !map || autocomplete) return;

        const input = document.getElementById('location-search-input') as HTMLInputElement;
        if (!input) return;

        const newAutocomplete = new google.maps.places.Autocomplete(input, {
            fields: ['formatted_address', 'geometry', 'name'],
            componentRestrictions: { country: 'rw' }, // Restrict to Rwanda
        });

        newAutocomplete.addListener('place_changed', () => {
            const place = newAutocomplete.getPlace();

            if (place.geometry?.location) {
                const location = place.formatted_address || place.name || '';
                const coords = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };

                setSelectedLocation(location);
                setSearchInput(location);
                setCoordinates(coords);
                onChange(location, coords);

                // Update map and marker
                if (map) {
                    map.setCenter(coords);
                    map.setZoom(15);
                    updateMarker(coords);
                }
            }
        });

        setAutocomplete(newAutocomplete);
    }, [isMapLoaded, map, autocomplete, onChange, updateMarker]);

    // Attach dragend listener to marker
    useEffect(() => {
        if (!marker) return;

        const listener = marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                handleMapClick(e.latLng);
            }
        });

        return () => {
            google.maps.event.removeListener(listener);
        };
    }, [marker, handleMapClick]);

    const handleClear = () => {
        setSearchInput('');
        setSelectedLocation('');
        setCoordinates(null);
        onChange('');

        if (marker) {
            marker.setMap(null);
            setMarker(null);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setCoordinates(coords);

                if (map) {
                    map.setCenter(coords);
                    map.setZoom(15);
                    updateMarker(coords);
                }

                // Reverse geocode to get address
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: coords }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                    if (status === 'OK' && results && results[0]) {
                        const address = results[0].formatted_address;
                        setSelectedLocation(address);
                        setSearchInput(address);
                        onChange(address, coords);
                    }
                });
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your current location');
            }
        );
    };

    if (!isMapLoaded) {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Pickup Location
                </label>
                <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading map...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Pickup Location
            </label>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    id="location-search-input"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={placeholder}
                    className="pl-10 pr-20 h-12"
                />
                {searchInput && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                        aria-label="Clear location"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Current Location Button */}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseCurrentLocation}
                className="w-full"
            >
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
            </Button>

            {/* Map Container */}
            <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300">
                <div id="map" className="w-full h-full"></div>
            </div>

            {/* Selected Location Display */}
            {selectedLocation && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900">Selected Location</p>
                            <p className="text-sm text-green-700 mt-1">{selectedLocation}</p>
                            {coordinates && (
                                <p className="text-xs text-green-600 mt-1">
                                    Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
            )}

        </div>
    );
}
