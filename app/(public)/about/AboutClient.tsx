'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Utensils, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type TeamMember = {
    id: string;
    name: string;
    role: string;
    image: string | null;
    bio: string | null;
};

type AboutSettings = {
    heroHeadline: string;
    visionHeadline: string;
    visionStory: string;
};

export default function AboutClient({ initialTeam, settings }: { initialTeam: TeamMember[], settings: AboutSettings }) {
    const [team] = useState(initialTeam);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    return (
        <div className="min-h-screen bg-[#F5F0E6]">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80"
                        alt="NL Josephine's Hotel Interior"
                        className="w-full h-full object-cover object-center scale-105 transform origin-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F2C23]/80 via-[#0F2C23]/60 to-[#F5F0E6]" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block px-4 py-1.5 rounded-full border border-[#C9A05B]/30 bg-[#C9A05B]/10 text-[#C9A05B] text-xs font-bold tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
                    >
                        Our Heritage
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-[1.1] tracking-tight whitespace-pre-wrap"
                    >
                        {settings.heroHeadline.replace(/\\n/g, '\n')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-gray-200 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        Discover the story, vision, and uncompromising dedication behind NL Josephine&apos;s Hotel&apos;s premier luxury living experience.
                    </motion.p>
                </div>
            </section>

            {/* The Vision / Our Story */}
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                        >
                            <span className="text-[#C9A05B] font-medium tracking-widest uppercase text-sm mb-6 block">Our Story</span>
                            <h2 className="text-4xl md:text-5xl font-light text-[#0F2C23] mb-8 leading-tight">
                                {settings.visionHeadline}
                            </h2>
                            <div className="prose prose-stone prose-lg text-gray-500 font-light leading-relaxed whitespace-pre-wrap">
                                {settings.visionStory}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80"
                                    alt="Architecture details"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-2/3 aspect-square rounded-[40px] overflow-hidden shadow-xl border-8 border-[#F5F0E6] z-20">
                                <img
                                    src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80"
                                    alt="Luxury interior"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-10 -right-10 w-40 h-40 bg-[#C9A05B]/10 rounded-full blur-3xl z-0" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Pillars Grid */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <span className="text-[#C9A05B] font-medium tracking-widest uppercase text-sm mb-4 block">The Foundation</span>
                        <h2 className="text-4xl md:text-5xl font-light text-[#0F2C23]">Our Core Pillars</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-[#F5F0E6] rounded-[40px] p-10 group hover:bg-[#0F2C23] transition-colors duration-500"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 text-[#0F2C23] group-hover:bg-[#C9A05B] group-hover:text-white transition-colors duration-500 shadow-sm">
                                <Building2 size={24} />
                            </div>
                            <h3 className="text-2xl font-medium text-[#0F2C23] mb-4 group-hover:text-white transition-colors duration-500">Elevated Living</h3>
                            <p className="text-gray-500 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                                Architecturally stunning spaces designed for absolute comfort, featuring premium amenities and meticulous attention to detail.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-[#C9A05B]/5 border border-[#C9A05B]/20 rounded-[40px] p-10 group hover:bg-[#C9A05B] hover:border-transparent transition-all duration-500"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 text-[#C9A05B] group-hover:bg-white/20 group-hover:text-white transition-colors duration-500 shadow-sm">
                                <Utensils size={24} />
                            </div>
                            <h3 className="text-2xl font-medium text-[#0F2C23] mb-4 group-hover:text-white transition-colors duration-500">Culinary Excellence</h3>
                            <p className="text-gray-600 font-light leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                                Home to NL Josephine&apos;s Gastronomy, where we celebrate the art of taste with organic ingredients and masterful global cuisine.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-[#F5F0E6] rounded-[40px] p-10 group hover:bg-[#0F2C23] transition-colors duration-500"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 text-[#0F2C23] group-hover:bg-[#C9A05B] group-hover:text-white transition-colors duration-500 shadow-sm">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-2xl font-medium text-[#0F2C23] mb-4 group-hover:text-white transition-colors duration-500">Serene & Secure</h3>
                            <p className="text-gray-500 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                                Uncompromising 24/7 security protocols and private access ensure your peace of mind is never disturbed.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Meet the Team */}
            {team.length > 0 && (
                <section className="py-24 px-6 md:py-32">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                        >
                            <div>
                                <span className="text-[#C9A05B] font-medium tracking-widest uppercase text-sm mb-4 block">Leadership</span>
                                <h2 className="text-4xl md:text-5xl font-light text-[#0F2C23]">The People Behind<br />The Sanctuary</h2>
                            </div>
                            <p className="text-gray-500 font-light max-w-sm">
                                A dedicated team of professionals committed to delivering an exceptional living experience.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="aspect-[3/4] rounded-[32px] overflow-hidden mb-6 relative bg-gray-100">
                                        <img
                                            src={member.image || '/placeholder-user.jpg'}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C23]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <h4 className="text-xl font-medium text-[#0F2C23] mb-1">{member.name}</h4>
                                    <p className="text-[#C9A05B] text-xs font-bold uppercase tracking-wider mb-3">{member.role}</p>
                                    {member.bio && (
                                        <p className="text-gray-500 text-sm font-light line-clamp-3">
                                            {member.bio}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0F2C23]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A05B]/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Sparkles size={40} className="text-[#C9A05B] mx-auto mb-8" />
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
                        Experience the <span className="italic font-serif text-[#C9A05B]">Sanctuary</span>
                    </h2>
                    <Link href="/apartments" className="inline-flex items-center gap-3 bg-white text-[#0F2C23] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#C9A05B] hover:text-white transition-all duration-500 group">
                        Discover Apartments
                        <div className="w-6 h-6 rounded-full bg-[#0F2C23]/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
