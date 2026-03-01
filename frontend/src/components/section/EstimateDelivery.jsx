'use client';

import React, { useState } from 'react';

const BASE_LAT = 28.8388;  // Moradabad (your shop location)
const BASE_LNG = 78.7733;

const DeliveryEstimator = () => {
    const [pincode, setPincode] = useState('');
    const [deliveryDays, setDeliveryDays] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Haversine formula - calculates straight-line distance between two coordinates
    const getDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const calculateDelivery = async () => {
        if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            setError('Please enter a valid 6-digit pincode');
            return;
        }

        setIsLoading(true);
        setError('');
        setDeliveryDays(null);

        try {
            // STEP 1: Validate pincode using India Post API (free, no key needed)
            const indiaPostRes = await fetch(
                `https://api.postalpincode.in/pincode/${pincode}`
            );
            const indiaPostData = await indiaPostRes.json();

            if (
                !indiaPostData ||
                indiaPostData[0].Status === 'Error' ||
                !indiaPostData[0].PostOffice ||
                indiaPostData[0].PostOffice === null
            ) {
                setError('Invalid pincode. Please check and try again.');
                setIsLoading(false);
                return;
            }

            const postOffice = indiaPostData[0].PostOffice[0];
            const cityName = postOffice.District;
            const stateName = postOffice.State;

            // STEP 2: Get lat/lng using city + state name via Nominatim (free, no key needed)
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)},${encodeURIComponent(stateName)},India&limit=1`,
                {
                    headers: {
                        'Accept-Language': 'en',
                        // Nominatim requires a User-Agent header for fair use policy
                        'User-Agent': 'DeliveryEstimatorApp/1.0'
                    }
                }
            );
            const geoData = await geoRes.json();

            // Fake delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (!geoData || geoData.length === 0) {
                setError('Could not resolve location. Please try again.');
                setIsLoading(false);
                return;
            }

            const targetLat = parseFloat(geoData[0].lat);
            const targetLng = parseFloat(geoData[0].lon);

            // STEP 3: Calculate distance from your shop (Moradabad) to destination
            const distance = getDistance(BASE_LAT, BASE_LNG, targetLat, targetLng);

            // STEP 4: Estimate delivery days based on distance (pan-India)
            let days;
            if (distance <= 50)        days = 1;
            else if (distance <= 150)  days = 2;
            else if (distance <= 300)  days = 3;
            else if (distance <= 500)  days = 4;
            else if (distance <= 800)  days = 5;
            else if (distance <= 1200) days = 6;
            else                       days = 7;

            setDeliveryDays({
                days,
                distance: Math.round(distance),
                cityName,
                stateName
            });

        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Allow Enter key to trigger check
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') calculateDelivery();
    };

    return (
        <div className="max-w-md mx-auto p-6 mt-5 bg-white rounded-lg shadow-md border">
            <div className="flex flex-col space-y-4">

                {/* Header */}
                <div className="text-center pb-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Check Estimated Delivery
                    </h3>
                    <p className="text-xs text-gray-500">Enter your pincode to know delivery time</p>
                </div>

                {/* Pincode Input */}
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Enter 6-digit Pincode"
                        value={pincode}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ''); // only digits
                            setPincode(val);
                            setError('');
                            setDeliveryDays(null);
                        }}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
                        maxLength={6}
                        inputMode="numeric"
                    />
                    <button
                        onClick={calculateDelivery}
                        disabled={isLoading}
                        className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center text-sm"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Checking...
                            </>
                        ) : (
                            'Check'
                        )}
                    </button>
                </div>

                {/* Full screen loading overlay */}
                {isLoading && (
                    <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-xl text-center shadow-2xl">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-base font-semibold text-gray-800">Calculating delivery time...</p>
                            <p className="text-xs text-gray-400 mt-1">Fetching pincode details from India Post</p>
                        </div>
                    </div>
                )}

                {/* Success Result */}
                {deliveryDays && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center space-y-1">
                        <p className="text-2xl font-bold text-green-700">
                            {deliveryDays.days} {deliveryDays.days === 1 ? 'Day' : 'Days'}
                        </p>
                        <p className="text-sm text-gray-500">Estimated delivery time</p>
                        <div className="mt-2 pt-2 border-t border-green-200">
                            <p className="text-sm text-gray-700">
                                📍 <span className="font-semibold text-green-800">
                                    {deliveryDays.cityName}, {deliveryDays.stateName}
                                </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                ~{deliveryDays.distance} km from our warehouse
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-center">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Footer note */}
                <p className="text-xs text-gray-400 text-center">
                    * Delivery estimates are approximate and may vary
                </p>

            </div>
        </div>
    );
};

export default DeliveryEstimator;