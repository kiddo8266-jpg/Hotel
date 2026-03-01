'use client';

import { motion } from 'framer-motion';
import { Wifi, Home, Bath, Tv, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Apartment = {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    size: number;
    features: string;
};

function ApartmentCard({ apt, index }: { apt: Apartment; index: number }) {
    const featuresList = apt.features ? apt.features.split(',').map(f => f.trim()) : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="group relative overflow-hidden bg-white shadow-xl rounded-xl border border-gray-100 flex flex-col h-[500px]"
        >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${apt.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C23]/90 via-[#0F2C23]/40 to-transparent" />
            </div>

            <div className="relative z-10 p-8 flex flex-col h-full justify-end text-white">
                <div>
                    <h3 className="text-3xl font-serif mb-2">{apt.title}</h3>
                    <p className="text-[#C9A05B] font-medium tracking-wide mb-4">UGX {apt.price.toLocaleString()} / Night</p>
                </div>

                {/* The Foldable Detail Section */}
                <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-in-out">
                    <div className="overflow-hidden">
                        <p className="text-gray-200 text-sm font-light mb-4 line-clamp-2">{apt.description}</p>

                        <div className="flex gap-4 text-sm text-gray-300 mb-6">
                            <span className="flex items-center gap-1"><Home size={16} /> {apt.bedrooms} Bed</span>
                            <span className="flex items-center gap-1"><Bath size={16} /> {apt.bathrooms} Bath</span>
                            <span className="flex items-center gap-1"><Wifi size={16} /> {apt.size} sqm</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            {featuresList.slice(0, 4).map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                    <CheckCircle2 size={12} className="text-[#C9A05B]" /> {f}
                                </div>
                            ))}
                        </div>

                        <Button className="w-full bg-[#C9A05B] hover:bg-white text-[#0F2C23] transition-colors rounded-full">
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function SuitesSection({ apartments }: { apartments: Apartment[] }) {
    return (
        <section id="suites" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif text-[#0F2C23] mb-4"
                    >
                        Distinctive Suites
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        className="w-24 h-1 bg-[#C9A05B] mx-auto mb-6 origin-left"
                    />
                    <p className="text-gray-600 font-light">
                        Each suite at Josephine Haven is individually curated to offer exceptional comfort,
                        blending modern aesthetics with thoughtful amenities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {apartments.map((apt, index) => (
                        <ApartmentCard key={apt.id} apt={apt} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
