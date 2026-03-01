'use client';

import { motion } from 'framer-motion';
import { ImageIcon, VideoIcon, Calendar } from 'lucide-react';

type MediaItem = {
    id: string;
    url: string;
    type: string;
    alt: string;
    section: string;
    area: string;
    // createdAt is serialized to ISO string by Next.js when passing from server to client component
    createdAt: string;
};

function GalleryCard({ item, index }: { item: MediaItem; index: number }) {
    const uploadDate = new Date(item.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl shadow-xl bg-[#0F2C23] flex flex-col h-72"
        >
            {item.type === 'video' ? (
                <video
                    src={item.url}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                />
            ) : (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.url})` }}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C23]/90 via-[#0F2C23]/30 to-transparent" />

            <div className="relative z-10 p-6 flex flex-col h-full justify-end text-white">
                {/* The Foldable Detail Section */}
                <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-in-out">
                    <div className="overflow-hidden">
                        {item.area && (
                            <span className="inline-block bg-[#C9A05B]/20 text-[#C9A05B] text-xs font-medium px-2 py-0.5 rounded mb-2">
                                {item.area}
                            </span>
                        )}
                        {item.alt && (
                            <p className="text-gray-200 text-sm font-light mb-3 line-clamp-2">{item.alt}</p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-300 mb-2">
                            <span className="flex items-center gap-1">
                                {item.type === 'video' ? (
                                    <><VideoIcon size={12} className="text-[#C9A05B]" /> Video</>
                                ) : (
                                    <><ImageIcon size={12} className="text-[#C9A05B]" /> Image</>
                                )}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={12} className="text-[#C9A05B]" /> {uploadDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function GalleryPageClient({ items }: { items: MediaItem[] }) {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F5F0E6] px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-light text-[#0F2C23] text-center mb-4">
                    Gallery
                </h1>
                <div className="w-24 h-1 bg-[#C9A05B] mx-auto mb-12" />

                {items.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No gallery items yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, index) => (
                            <GalleryCard key={item.id} item={item} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
