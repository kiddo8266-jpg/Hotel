'use client';

import { motion } from 'framer-motion';
import { Wifi, ShieldCheck, Car, Leaf, Wine, Zap, Tv, Sparkles, Home, Bath } from 'lucide-react';

const iconMap: Record<string, any> = {
    Wifi, ShieldCheck, Car, Leaf, Wine, Zap, Tv, Sparkles, Home, Bath
};

type Amenity = {
    id: string;
    iconName: string;
    title: string;
    description: string;
    image?: string | null;
};

export default function AmenitiesSection({
    amenities,
    heading,
    description,
    subtitle,
    experienceTitle,
    experienceLabel,
    amenitiesImage
}: {
    amenities: Amenity[];
    heading?: string;
    description?: string;
    subtitle?: string;
    experienceTitle?: string;
    experienceLabel?: string;
    amenitiesImage?: string;
}) {
    if (!amenities || amenities.length === 0) return null;

    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative order-2 lg:order-1"
                    >
                        <div className="aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative z-10">
                            <img
                                src={amenitiesImage || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2600&auto=format&fit=crop"}
                                alt="Luxury Hotel Amenities"
                                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C23]/80 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <span className="text-[#C9A05B] font-bold tracking-widest uppercase text-xs mb-2 block">
                                    {experienceLabel || "Unparalleled Comfort"}
                                </span>
                                <h3 className="text-3xl font-light text-white leading-tight">
                                    {experienceTitle || "Everything you need, beautifully anticipated."}
                                </h3>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -left-10 w-2/3 aspect-square rounded-[40px] border border-[#C9A05B]/30 -z-10" />
                        <div className="absolute -bottom-10 -right-10 w-1/2 aspect-square rounded-[40px] bg-[#F5F0E6] -z-10 shadow-xl" />
                    </motion.div>

                    {/* Content Side */}
                    <div className="order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-xl"
                        >
                            <span className="text-[#C9A05B] font-medium tracking-widest uppercase text-sm mb-6 block">
                                {subtitle || "The Experience"}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-light text-[#0F2C23] mb-8 leading-tight">
                                {heading || "Curated Amenities"}
                            </h2>
                            <p className="text-gray-500 font-light leading-relaxed mb-10">
                                {description || "We believe true luxury lies in the details. Discover a thoughtful collection of amenities designed to elevate every moment of your stay with us."}
                            </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                            {amenities.map((amenity, index) => {
                                const Icon = iconMap[amenity.iconName] || Home;
                                return (
                                    <motion.div
                                        key={amenity.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <div className="flex items-start gap-4">
                                            {amenity.image ? (
                                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#C9A05B]/30 shrink-0 shadow-md group-hover:ring-2 group-hover:ring-[#C9A05B] transition-all duration-500">
                                                    <img
                                                        src={amenity.image}
                                                        alt={amenity.title}
                                                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-[#F5F0E6] flex items-center justify-center shrink-0 group-hover:bg-[#0F2C23] transition-colors duration-500">
                                                    <Icon size={20} className="text-[#0F2C23] group-hover:text-[#C9A05B] transition-colors duration-500" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-[#0F2C23] font-medium mb-1 group-hover:text-[#C9A05B] transition-colors duration-300">{amenity.title}</h4>
                                                <p className="text-gray-500 text-sm font-light leading-relaxed">{amenity.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Experience Highlight Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="mt-32 p-12 md:p-20 rounded-[60px] bg-[#0F2C23] relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A05B]/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-700 group-hover:bg-[#C9A05B]/20" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <span className="text-[#C9A05B] font-medium tracking-[0.3em] uppercase text-xs mb-8">
                            {experienceLabel || "Unparalleled Comfort"}
                        </span>
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-10 leading-tight">
                            {experienceTitle || "Everything you need, beautifully anticipated."}
                        </h3>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
