'use client';

import { motion } from 'framer-motion';
import { Wifi, Home, Bath, Tv, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApartmentCard, { type Apartment } from './ApartmentCard';

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
