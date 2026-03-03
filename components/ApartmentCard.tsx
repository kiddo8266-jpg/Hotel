'use client';

import { motion } from 'framer-motion';
import { Wifi, Home, Bath, Maximize, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type Apartment = {
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

export default function ApartmentCard({ apt, index }: { apt: Apartment; index: number }) {
    const featuresList = apt.features ? apt.features.split(',').map(f => f.trim()) : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="group relative overflow-hidden bg-white shadow-2xl rounded-3xl border border-white/20 flex flex-col h-[550px]"
        >
            {/* Image Section */}
            <div className="relative h-2/3 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${apt.image})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C23]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 z-20">
                    <p className="text-[#0F2C23] font-semibold text-sm">
                        UGX {apt.price.toLocaleString()} <span className="text-[10px] opacity-70 uppercase tracking-tighter">/ month</span>
                    </p>
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 left-4 bg-[#C9A05B] text-[#0F2C23] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                    {apt.type}
                </div>
            </div>

            {/* Content Section */}
            <div className="relative flex-1 p-8 flex flex-col justify-between bg-white group-hover:bg-[#0F2C23] transition-colors duration-500 group-hover:text-white z-20">
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-serif leading-tight transition-colors duration-500 text-[#0F2C23] group-hover:text-white">
                            {apt.title}
                        </h3>
                    </div>

                    {/* Amenities Row */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 group-hover:text-gray-300 transition-colors duration-500">
                        <span className="flex items-center gap-1.5"><Home size={16} className="text-[#C9A05B]" /> {apt.bedrooms} Bed</span>
                        <span className="flex items-center gap-1.5"><Bath size={16} className="text-[#C9A05B]" /> {apt.bathrooms} Bath</span>
                        <span className="flex items-center gap-1.5"><Maximize size={16} className="text-[#C9A05B]" /> {apt.size} sqm</span>
                    </div>

                    <div
                        className="text-gray-600 group-hover:text-gray-400 text-sm font-light line-clamp-2 transition-colors duration-500 prose-sm"
                        dangerouslySetInnerHTML={{ __html: apt.description }}
                    />
                </div>

                <div className="pt-6 flex gap-3">
                    <Link href={`/apartments/${apt.id}`} className="flex-1">
                        <Button className="w-full bg-[#0F2C23] group-hover:bg-[#C9A05B] text-white group-hover:text-[#0F2C23] transition-all duration-300 rounded-full h-12 flex items-center justify-center gap-2 border border-[#0F2C23] group-hover:border-[#C9A05B]">
                            View Details <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
