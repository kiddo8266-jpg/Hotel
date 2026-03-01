import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Home, Bath, Maximize, CheckCircle2, Phone, Mail, MapPin, Calendar, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default async function ApartmentDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    const apartment = await prisma.apartment.findUnique({
        where: { id },
    });

    if (!apartment) {
        notFound();
    }

    const featuresList = apartment.features ? apartment.features.split(',').map(f => f.trim()) : [];

    return (
        <div className="min-h-screen bg-[#fdfbf7]">
            {/* Hero Section */}
            <section className="relative h-[70vh] w-full">
                <img
                    src={apartment.image}
                    alt={apartment.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-6">
                        <Link href="/apartments" className="text-[#C9A05B] mb-4 inline-block hover:underline">
                            ← Back to Apartments
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-serif">{apartment.title}</h1>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Highlights */}
                        <div className="flex flex-wrap gap-8 py-8 border-y border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#0F2C23]/5 rounded-full flex items-center justify-center">
                                    <Home className="text-[#0F2C23]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Bedrooms</p>
                                    <p className="font-semibold">{apartment.bedrooms} Bedrooms</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#0F2C23]/5 rounded-full flex items-center justify-center">
                                    <Bath className="text-[#0F2C23]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Bathrooms</p>
                                    <p className="font-semibold">{apartment.bathrooms} Bathrooms</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#0F2C23]/5 rounded-full flex items-center justify-center">
                                    <Maximize className="text-[#0F2C23]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Size</p>
                                    <p className="font-semibold">{apartment.size} sqm</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-3xl font-serif text-[#0F2C23] mb-6">About this Apartment</h2>
                            <p className="text-lg text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
                                {apartment.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h2 className="text-3xl font-serif text-[#0F2C23] mb-8">What this place offers</h2>
                            <div className="grid md:grid-cols-2 gap-y-4 gap-x-12">
                                {featuresList.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50">
                                        <CheckCircle2 size={20} className="text-[#C9A05B]" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Inquiry Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            {/* Price Card */}
                            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                                <p className="text-3xl font-serif text-[#0F2C23] mb-6">
                                    UGX {apartment.price.toLocaleString()} <span className="text-sm font-sans font-normal text-gray-400">/ month</span>
                                </p>

                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Input placeholder="Full Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Input type="email" placeholder="Email Address" />
                                    </div>
                                    <div className="space-y-2">
                                        <Input placeholder="Phone Number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Textarea placeholder="Message / Questions" className="h-32" />
                                    </div>
                                    <Button className="w-full bg-[#0F2C23] hover:bg-[#1a4a3b] text-white h-14 rounded-full text-lg mt-4">
                                        Send Inquiry
                                    </Button>
                                </form>

                                <p className="text-[10px] text-center text-gray-400 mt-6 px-4">
                                    Our team will get back to you within 24 hours regarding availability and viewing.
                                </p>
                            </div>

                            {/* Contact Quick Info */}
                            <div className="bg-[#0F2C23] p-8 rounded-3xl text-white">
                                <h4 className="text-xl font-serif mb-6 text-[#C9A05B]">Contact Support</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-[#C9A05B]" />
                                        <span>0772560696</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-[#C9A05B]" />
                                        <span className="text-sm">info@josephinehaven.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
