'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, VideoIcon, Calendar, X, Maximize2 } from 'lucide-react';

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

function GalleryCard({ item, index, onClick }: { item: MediaItem; index: number; onClick: () => void }) {
    const uploadDate = new Date(item.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const isTall = index % 3 === 2;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            onClick={onClick}
            className={`group relative overflow-hidden rounded-xl shadow-xl bg-[#0F2C23] flex flex-col cursor-pointer ${isTall ? 'row-span-2 h-96' : 'h-72'}`}
        >
            {item.type === 'video' ? (
                <video
                    src={item.url}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    muted
                    loop
                    playsInline
                />
            ) : (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.url})` }}
                />
            )}

            {/* Static gradient always visible at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C23]/60 via-transparent to-transparent" />

            {/* Directional sweep overlay on hover */}
            <div
                className="absolute inset-0 flex flex-col justify-end p-5 translate-y-full group-hover:translate-y-0 backdrop-blur-sm transition-transform duration-500 ease-in-out"
                style={{ backgroundColor: 'rgba(15, 44, 35, 0.85)' }}
            >
                {item.area && (
                    <span className="inline-block bg-[#C9A05B]/20 text-[#C9A05B] text-xs font-medium px-2 py-0.5 rounded mb-2 w-fit">
                        {item.area}
                    </span>
                )}
                {item.alt && (
                    <p className="text-gray-200 text-sm font-light mb-3 line-clamp-2">{item.alt}</p>
                )}
                <div className="flex gap-4 text-xs text-gray-300 mb-3">
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
                <span className="flex items-center gap-1 text-xs text-[#C9A05B] font-medium">
                    <Maximize2 size={12} /> View
                </span>
            </div>
        </motion.div>
    );
}

function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
    const uploadDate = new Date(item.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                aria-label="Close"
            >
                <X size={20} />
            </button>

            {/* Modal content — stop propagation so clicking image/details doesn't close */}
            <div
                className="flex flex-col items-center max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
            >
                {item.type === 'video' ? (
                    <video
                        src={item.url}
                        className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.url}
                        alt={item.alt}
                        className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
                    />
                )}

                <div className="mt-4 text-center text-white space-y-1">
                    {item.area && (
                        <span className="inline-block bg-[#C9A05B]/20 text-[#C9A05B] text-xs font-medium px-2 py-0.5 rounded">
                            {item.area}
                        </span>
                    )}
                    {item.alt && (
                        <p className="text-gray-300 text-sm">{item.alt}</p>
                    )}
                    <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                        <Calendar size={11} className="text-[#C9A05B]" /> {uploadDate}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function GalleryPageClient({ items }: { items: MediaItem[] }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

    const areas = ['All', ...Array.from(new Set(items.map((i) => i.area).filter(Boolean)))];

    const filtered = activeFilter === 'All' ? items : items.filter((i) => i.area === activeFilter);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F5F0E6] px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-light text-[#0F2C23] text-center mb-4">
                    Gallery
                </h1>
                <div className="w-24 h-1 bg-[#C9A05B] mx-auto mb-8" />

                {/* Category Filter Tabs */}
                <div className="flex overflow-x-auto gap-2 pb-2 mb-10 scrollbar-hide justify-center">
                    {areas.map((area) => (
                        <button
                            key={area}
                            onClick={() => setActiveFilter(area)}
                            className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 ${
                                activeFilter === area
                                    ? 'border-[#C9A05B] bg-[#C9A05B] text-white'
                                    : 'border-gray-300 text-gray-500 hover:border-[#C9A05B]/50 hover:text-[#C9A05B]'
                            }`}
                        >
                            {area}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <ImageIcon size={64} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No gallery items yet.</p>
                        <p className="text-gray-400 text-sm mt-1">Check back soon for stunning photographs of our property.</p>
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        style={{ gridAutoRows: '18rem' }}
                    >
                        {filtered.map((item, index) => (
                            <GalleryCard
                                key={item.id}
                                item={item}
                                index={index}
                                onClick={() => setSelectedItem(item)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedItem && (
                <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
}
