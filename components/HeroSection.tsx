'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroItem {
    id: string;
    title: string | null;
    subtitle: string | null;
    mediaUrl: string;
    mediaType: string;
}

export default function HeroSection({
    items = [],
    fallback,
}: {
    items?: HeroItem[];
    fallback: { title: string; subtitle: string; image: string };
}) {
    const activeItem = items.length > 0 ? items[0] : null;
    const title = activeItem?.title || fallback.title;
    const subtitle = activeItem?.subtitle || fallback.subtitle;
    const mediaUrl = activeItem?.mediaUrl || fallback.image;
    const isVideo = activeItem?.mediaType === 'video';

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {isVideo ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={mediaUrl} type="video/mp4" />
                    </video>
                ) : (
                    <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
                        style={{ backgroundImage: `url(${mediaUrl})` }}
                    />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#0F2C23]/60 mix-blend-multiply" />
            </div>

            <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto pt-20">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block px-4 py-1.5 rounded-full border border-[#C9A05B]/30 bg-[#C9A05B]/10 text-[#C9A05B] text-xs font-bold tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
                >
                    Welcome Home
                </motion.span>
                <motion.h1
                    key={title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-[1.1] tracking-tight whitespace-pre-wrap"
                >
                    {title}
                </motion.h1>

                <motion.p
                    key={subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed"
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <a href="#suites" className="inline-flex items-center gap-3 bg-white text-[#0F2C23] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#C9A05B] hover:text-white transition-all duration-500 group">
                        Discover Our Suites
                        <div className="w-6 h-6 rounded-full bg-[#0F2C23]/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

