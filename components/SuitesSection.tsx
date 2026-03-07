'use client';

import { motion } from 'framer-motion';
import { Wifi, Home, Bath, Tv, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Apartment } from './ApartmentCard';

export default function SuitesSection({
    apartments,
    heading,
    description
}: {
    apartments: Apartment[];
    heading?: string;
    description?: string;
}) {
    const defaultHeading = "Distinctive Suites";
    const defaultDescription = "Our most exclusive accommodations, individually curated to offer exceptional comfort, blending modern aesthetics with thoughtful amenities.";
    // Only show up to 3 featured suites on the homepage
    const featuredApartments = apartments.slice(0, 3);

    return (
        <section id="suites" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-7xl font-light text-[#0F2C23] mb-8 leading-[1.1] tracking-tight"
                    >
                        {heading || defaultHeading}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl"
                    >
                        {description || defaultDescription}
                    </motion.p>
                </div>

                <div className="flex flex-col gap-24">
                    {featuredApartments.map((apt, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={apt.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                                {/* Image Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7 }}
                                    className="w-full lg:w-1/2"
                                >
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative group">
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                                        <img
                                            src={apt.image || '/placeholder-apartment.jpg'}
                                            alt={apt.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-full">
                                            <span className="text-[#0F2C23] font-semibold">UGX {apt.price.toLocaleString()} <span className="text-[10px] opacity-70 uppercase tracking-tighter">/ month</span></span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Content Side */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: 0.2 }}
                                    className="w-full lg:w-1/2 flex flex-col justify-center"
                                >
                                    <span className="text-[#C9A05B] tracking-widest uppercase text-xs font-bold mb-4 block">
                                        Premium Collection
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-serif text-[#0F2C23] mb-6">
                                        {apt.title}
                                    </h3>
                                    <div
                                        className="text-gray-600 font-light leading-relaxed mb-8 line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: apt.description }}
                                    />

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Home className="w-5 h-5 text-[#C9A05B]" />
                                            <span className="font-light">{apt.bedrooms} Bedroom{apt.bedrooms > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Bath className="w-5 h-5 text-[#C9A05B]" />
                                            <span className="font-light">{apt.bathrooms} Bathroom{apt.bathrooms > 1 ? 's' : ''}</span>
                                        </div>
                                        {apt.features ? apt.features.split(',').slice(0, 2).map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 text-gray-700">
                                                <CheckCircle2 className="w-5 h-5 min-w-5 min-h-5 text-[#C9A05B]" />
                                                <span className="font-light truncate">{feature.trim()}</span>
                                            </div>
                                        )) : null}
                                    </div>

                                    <div>
                                        <Link
                                            href={`/apartments/${apt.id}`}
                                            className="inline-flex items-center gap-3 text-[#0F2C23] font-medium tracking-wide group border-b border-[#0F2C23] pb-2 hover:text-[#C9A05B] hover:border-[#C9A05B] transition-colors"
                                        >
                                            Explore Suite
                                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 text-center"
                >
                    <Link href="/apartments" className="inline-flex items-center justify-center gap-2 bg-[#0F2C23] text-white px-8 py-4 rounded-full font-light tracking-wide hover:bg-[#1a4a3b] transition-colors group">
                        Discover All Suites
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
