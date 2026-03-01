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

            <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
                <motion.h1
                    key={title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="text-5xl md:text-7xl font-serif mb-6 leading-tight"
                >
                    {title}
                </motion.h1>

                <motion.p
                    key={subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="text-lg md:text-2xl font-light mb-10 max-w-2xl mx-auto opacity-90"
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <a href="#suites" className="inline-block">
                        <Button className="bg-[#C9A05B] hover:bg-[#B38F4F] text-[#0F2C23] text-lg px-8 py-6 rounded-none transition-all duration-300 hover:shadow-lg uppercase tracking-wider font-medium">
                            Discover Our Suites
                        </Button>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

