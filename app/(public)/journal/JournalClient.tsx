'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Utensils, Building2, Ticket, Sparkles, X } from 'lucide-react';

type Post = {
    id: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    category: string;
    createdAt: string;
    author: {
        name: string;
    };
};

export default function JournalClient({ initialPosts }: { initialPosts: Post[] }) {
    const [posts] = useState(initialPosts);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        if (selectedPost) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selectedPost]);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F5F0E6]">
            {/* Hero Section */}
            <section className="px-6 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="text-[#C9A05B] font-medium tracking-widest uppercase text-sm mb-4 block">Our Stories</span>
                    <h1 className="text-5xl md:text-7xl font-light text-[#0F2C23] mb-6">The Journal</h1>
                    <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        Stay updated with the latest happenings, exclusive offers, and stories from our sanctuary.
                    </p>
                    <div className="w-24 h-1 bg-[#C9A05B] mx-auto mt-8" />
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
                    {/* Mixed Feed: Posts and Marketing */}
                    {posts.map((post, index) => {
                        const isDark = (index + 1) % 4 === 0;
                        const isAccent = (index + 2) % 5 === 0;

                        return (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`group rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col aspect-square ${isDark ? 'bg-[#0F2C23] text-white border-none' :
                                    isAccent ? 'bg-[#C9A05B]/5 border border-[#C9A05B]/20' :
                                        'bg-white border border-gray-100'
                                    }`}
                            >
                                <div className="relative h-[45%] overflow-hidden shrink-0">
                                    <img
                                        src={post.image || '/placeholder.jpg'}
                                        alt={post.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className={`text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full font-bold backdrop-blur-md ${isDark ? 'bg-white/10 text-white' : 'bg-[#0F2C23] text-white'
                                            }`}>
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1 overflow-hidden">
                                    <div className={`flex items-center gap-4 text-[10px] uppercase tracking-widest mb-4 font-bold ${isDark ? 'text-gray-400' : 'text-gray-400'
                                        }`}>
                                        <span className="flex items-center gap-2">
                                            <Calendar size={12} className="text-[#C9A05B]" />
                                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <User size={12} className="text-[#C9A05B]" />
                                            {post.author.name}
                                        </span>
                                    </div>
                                    <h2 className={`text-lg md:text-xl font-medium mb-2 transition-colors duration-500 line-clamp-2 leading-tight shrink-0 ${isDark ? 'text-white' : 'text-[#0F2C23] group-hover:text-[#C9A05B]'
                                        }`}>
                                        {post.title}
                                    </h2>
                                    <p className={`font-light text-xs md:text-sm mb-4 line-clamp-3 leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        {post.content}
                                    </p>
                                    <button
                                        onClick={() => setSelectedPost(post)}
                                        className={`flex items-center justify-center gap-3 font-bold text-[10px] mt-auto uppercase tracking-[0.2em] transition-all duration-500 px-6 py-3 rounded-full self-start group/btn ${isDark
                                            ? 'bg-white text-[#0F2C23] hover:bg-[#C9A05B] hover:text-white'
                                            : 'bg-[#0F2C23] text-white hover:bg-[#C9A05B]'
                                            }`}
                                    >
                                        Explore Story <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </div>
                            </motion.article>
                        );
                    })}

                    {/* Marketing Blocks Integrated into Grid */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#0F2C23] text-white p-10 rounded-[40px] relative overflow-hidden group shadow-xl flex flex-col justify-center aspect-square"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A05B]/20 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-[#C9A05B]/30 transition-all duration-700" />
                        <Ticket size={40} className="text-[#C9A05B] mb-6" />
                        <span className="text-[#C9A05B] text-[10px] uppercase tracking-[0.3em] font-black block mb-3">The Highlight</span>
                        <h3 className="text-2xl md:text-3xl font-light mb-4 text-white leading-tight">Saturday<br />Oldies Night</h3>
                        <p className="text-gray-300 font-light text-sm md:text-base mb-8 leading-relaxed max-w-[280px]">
                            A curated nostalgic journey through sound and soul. Every Saturday at 7:00 PM.
                        </p>
                        <div className="flex items-center gap-3 text-[#0F2C23] font-bold text-[10px] uppercase tracking-widest mt-auto bg-white hover:bg-[#C9A05B] hover:text-white transition-colors duration-500 w-fit px-6 py-3 rounded-full shadow-lg cursor-pointer">
                            <Sparkles size={12} /> Reserve Seat
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 rounded-[40px] group shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-100 flex flex-col aspect-square"
                    >
                        <div className="w-14 h-14 bg-[#F5F0E6] rounded-[20px] flex items-center justify-center mb-6 text-[#0F2C23] group-hover:bg-[#C9A05B] group-hover:text-white transition-all duration-500 shrink-0">
                            <Utensils size={28} />
                        </div>
                        <h3 className="text-2xl font-light text-[#0F2C23] mb-4 tracking-tight group-hover:text-[#C9A05B] transition-colors">Hotel Gastronomy</h3>
                        <p className="text-gray-500 font-light text-sm md:text-base mb-8 leading-relaxed flex-1 overflow-hidden">
                            Discover the art of taste in our premium dining hall. From local organic secrets to global masterpieces.
                        </p>
                        <button className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] bg-[#0F2C23] px-6 py-3 rounded-full hover:bg-[#C9A05B] transition-all duration-500 self-start mt-auto shadow-sm group/btn">
                            Reserve Table <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[40px] overflow-hidden shadow-xl group aspect-square"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2C23]/90 to-transparent z-10 transition-all duration-700" />
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
                            alt="Luxury Office"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 z-20 p-10 flex flex-col justify-end pointer-events-none">
                            <Building2 size={36} className="text-[#C9A05B] mb-5" />
                            <h3 className="text-2xl md:text-3xl font-light text-white mb-3 leading-tight">Elevated<br />Workspaces</h3>
                            <p className="text-gray-200 text-sm font-light mb-8 max-w-[200px] leading-relaxed">Luxury office suites to let in the heart of the hotel grounds.</p>
                            <button className="flex items-center justify-center gap-3 text-[#0F2C23] text-[10px] font-black uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-full hover:bg-[#C9A05B] hover:text-white transition-all duration-500 self-start mt-auto shadow-xl group/btn pointer-events-auto">
                                Send Enquiry <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {posts.length === 0 && (
                    <div className="py-20 text-center bg-white/50 backdrop-blur-md rounded-2xl border border-gray-200 mt-12 w-full">
                        <Sparkles className="mx-auto text-[#C9A05B] mb-4" size={48} />
                        <p className="text-gray-500 font-light">More stories coming soon.</p>
                    </div>
                )}
            </div>

            {/* Read More Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-6 right-6 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                            >
                                <X size={24} className="text-[#0F2C23]" />
                            </button>

                            <div className="overflow-y-auto w-full">
                                <div className="h-[40vh] relative">
                                    <img
                                        src={selectedPost.image || '/placeholder.jpg'}
                                        alt={selectedPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                </div>
                                <div className="p-8 md:p-12 -mt-20 relative bg-white rounded-t-[32px]">
                                    <div className="flex items-center gap-6 text-xs text-[#C9A05B] font-medium uppercase tracking-widest mb-6">
                                        <span className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(selectedPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <User size={14} />
                                            {selectedPost.author.name}
                                        </span>
                                        <span className="bg-[#0F2C23]/5 px-3 py-1 rounded-full text-[#0F2C23]">
                                            {selectedPost.category}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-light text-[#0F2C23] mb-8 leading-tight">
                                        {selectedPost.title}
                                    </h2>
                                    <div className="prose prose-stone max-w-none">
                                        <p className="text-gray-600 text-lg font-light leading-relaxed whitespace-pre-wrap">
                                            {selectedPost.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

