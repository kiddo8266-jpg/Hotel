// app/apartments/page.tsx

import { Button } from '@/components/ui/button';

export default function ApartmentsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F5F0E6] px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-light text-[#0F2C23] text-center mb-12">
                    Our Apartments
                </h1>

                <p className="text-xl text-center text-gray-700 max-w-3xl mx-auto mb-16">
                    Discover our range of fully furnished, modern apartments designed for comfort and convenience in Seguku.
                </p>

                {/* Placeholder for apartment cards – later pulled from database */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="h-64 bg-gray-200 flex items-center justify-center">
                            {/* Later: real image */}
                            <span className="text-gray-500">Apartment Image</span>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-medium mb-3">2-Bedroom Deluxe</h3>
                            <p className="text-gray-600 mb-6">
                                Spacious living area, modern kitchen, private balcony with garden view.
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-light text-[#0F2C23]">
                                    UGX 2,500,000 <span className="text-base">/ month</span>
                                </span>
                                <Button className="bg-[#C9A05B] hover:bg-[#B38F4F] text-[#0F2C23]">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Add 2–5 more similar cards for now */}
                </div>

                <div className="text-center mt-16">
                    <Button size="lg" variant="outline" className="border-[#0F2C23] text-[#0F2C23] hover:bg-[#0F2C23] hover:text-white">
                        Contact Us for Availability
                    </Button>
                </div>
            </div>
        </div>
    );
}