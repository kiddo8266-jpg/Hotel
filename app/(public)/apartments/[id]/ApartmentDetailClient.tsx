'use client';

import { useState } from 'react';
import { Home, Bath, Maximize, Phone, Mail, Wifi, ShieldCheck, Car, Leaf, Wine, Zap, Tv, Sparkles, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    Wifi, ShieldCheck, Car, Leaf, Wine, Zap, Tv, Sparkles, Home, Bath
};

type Amenity = { id: string; title: string; iconName: string; description: string; };
type ApartmentProps = {
    apartment: {
        id: string;
        title: string;
        description: string;
        price: number;
        priceDuration: string;
        image: string;
        type: string;
        bedrooms: number;
        bathrooms: number;
        size: number;
        features: string;
        amenities: Amenity[];
    };
    contactEmail: string;
    contactPhone: string;
};

export default function ApartmentDetailClient({ apartment, contactEmail, contactPhone }: ApartmentProps) {
    const featuresList = apartment.features ? apartment.features.split(',').map(f => f.trim()).filter(Boolean) : [];
    const linkedAmenities = apartment.amenities ?? [];

    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error('Please fill in your name, email, and message.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    apartmentName: apartment.title,
                    subject: `Room Viewing Request – ${apartment.title}`,
                }),
            });
            if (res.ok) {
                toast.success('Request sent! Our concierge will contact you within 24 hours.');
                setForm({ name: '', email: '', phone: '', message: '' });
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to send. Please try again.');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F0E6]">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full mt-24">
                <div className="absolute inset-0 m-6 rounded-[40px] overflow-hidden shadow-2xl">
                    <img src={apartment.image} alt={apartment.title} className="w-full h-full object-cover scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C23] via-[#0F2C23]/40 to-transparent" />
                    <div className="absolute top-8 left-8">
                        <Link href="/apartments" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#0F2C23] transition-colors">
                            <span>←</span> Back
                        </Link>
                    </div>
                    <div className="absolute bottom-16 left-16 right-16">
                        <div className="max-w-5xl">
                            <span className="inline-block px-4 py-1.5 rounded-full border border-[#C9A05B]/30 bg-[#C9A05B]/10 text-[#C9A05B] text-xs font-bold tracking-[0.3em] uppercase mb-6 backdrop-blur-md">
                                {apartment.type}
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight">{apartment.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-12 py-24">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Highlights */}
                        <div className="grid grid-cols-3 gap-8 py-10 border-y border-[#0F2C23]/10">
                            <div className="text-center group">
                                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C9A05B] transition-colors duration-500 shadow-sm border border-gray-100">
                                    <Home className="text-[#0F2C23] group-hover:text-white transition-colors" size={24} />
                                </div>
                                <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">Bedrooms</p>
                                <p className="font-serif text-2xl text-[#0F2C23]">{apartment.bedrooms}</p>
                            </div>
                            <div className="text-center group border-x border-[#0F2C23]/10">
                                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C9A05B] transition-colors duration-500 shadow-sm border border-gray-100">
                                    <Bath className="text-[#0F2C23] group-hover:text-white transition-colors" size={24} />
                                </div>
                                <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">Bathrooms</p>
                                <p className="font-serif text-2xl text-[#0F2C23]">{apartment.bathrooms}</p>
                            </div>
                            <div className="text-center group">
                                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C9A05B] transition-colors duration-500 shadow-sm border border-gray-100">
                                    <Maximize className="text-[#0F2C23] group-hover:text-white transition-colors" size={24} />
                                </div>
                                <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">Total Size</p>
                                <p className="font-serif text-2xl text-[#0F2C23]">{apartment.size} <span className="text-sm font-sans">sqm</span></p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-3xl font-light text-[#0F2C23] mb-8">About this sanctuary</h2>
                            <div className="prose prose-stone prose-lg text-gray-600 font-light leading-relaxed max-w-none"
                                dangerouslySetInnerHTML={{ __html: apartment.description }} />
                        </div>

                        {/* Dynamic Amenities (linked) */}
                        {linkedAmenities.length > 0 && (
                            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-light text-[#0F2C23] mb-8">Curated Amenities</h2>
                                <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">
                                    {linkedAmenities.map((amenity) => {
                                        const Icon = iconMap[amenity.iconName] || CheckCircle2;
                                        return (
                                            <div key={amenity.id} className="flex items-start gap-4 group">
                                                <div className="w-12 h-12 rounded-full bg-[#F5F0E6] flex items-center justify-center shrink-0 group-hover:bg-[#0F2C23] transition-colors duration-500">
                                                    <Icon size={20} className="text-[#0F2C23] group-hover:text-[#C9A05B] transition-colors duration-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[#0F2C23] font-medium mb-1 group-hover:text-[#C9A05B] transition-colors duration-300">{amenity.title}</h4>
                                                    <p className="text-gray-500 text-sm font-light leading-relaxed">{amenity.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Legacy text features fallback */}
                        {featuresList.length > 0 && linkedAmenities.length === 0 && (
                            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-light text-[#0F2C23] mb-8">Room Features</h2>
                                <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                                    {featuresList.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <CheckCircle2 size={24} className="text-[#C9A05B] shrink-0 mt-0.5" />
                                            <span className="text-gray-600 font-light">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            {/* Price Card + Enquiry Form */}
                            <div className="bg-[#0F2C23] p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A05B]/10 rounded-full blur-[80px]" />
                                <div className="relative z-10">
                                    <p className="text-[#C9A05B] text-xs font-bold uppercase tracking-widest mb-4">Book a Viewing</p>
                                    <p className="text-4xl font-light text-white mb-8 border-b border-white/10 pb-8">
                                        UGX {apartment.price.toLocaleString()}
                                        <span className="text-sm font-sans font-normal text-gray-400 block mt-2">{apartment.priceDuration}</span>
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-4">
                                            <Input
                                                placeholder="Full Name *"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                required
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-12 rounded-xl focus:border-[#C9A05B]"
                                            />
                                            <Input
                                                type="email"
                                                placeholder="Email Address *"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                required
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-12 rounded-xl focus:border-[#C9A05B]"
                                            />
                                            <Input
                                                placeholder="Phone Number"
                                                value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-12 rounded-xl focus:border-[#C9A05B]"
                                            />
                                            <Textarea
                                                placeholder="Message / Questions *"
                                                value={form.message}
                                                onChange={e => setForm({ ...form, message: e.target.value })}
                                                required
                                                className="h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-xl focus:border-[#C9A05B] resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-[#C9A05B] hover:bg-white disabled:opacity-60 text-[#0F2C23] h-14 rounded-full text-sm font-bold uppercase tracking-widest mt-8 transition-colors duration-500"
                                        >
                                            {submitting ? 'Sending…' : 'Request Viewing'}
                                        </button>
                                    </form>

                                    <p className="text-[11px] text-center text-gray-400 mt-6 font-light leading-relaxed">
                                        A dedicated concierge will contact you within 24 hours to arrange a private viewing.
                                    </p>
                                </div>
                            </div>

                            {/* Contact Quick Info */}
                            <div className="bg-[#0F2C23] p-8 rounded-3xl text-white">
                                <h4 className="text-xl font-serif mb-6 text-[#C9A05B]">Contact Support</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-[#C9A05B]" />
                                        <a href={`tel:${contactPhone}`} className="hover:text-[#C9A05B] transition-colors">{contactPhone}</a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-[#C9A05B]" />
                                        <a href={`mailto:${contactEmail}`} className="text-sm hover:text-[#C9A05B] transition-colors">{contactEmail}</a>
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
