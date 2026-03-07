'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Utensils, Building2, Ticket, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

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

type MarketingCard = {
    id: string;
    tag: string;
    title: string;
    description: string;
    image: string;
    buttonLabel: string;
    subject: string;
    order: number;
    isActive: boolean;
};

type HeroContent = {
    label: string;
    title: string;
    description: string;
    backgroundImage?: string;
};

// Default hardcoded cards used when no cards are stored in DB yet
const DEFAULT_MARKETING_CARDS: MarketingCard[] = [
    {
        id: '__default_1',
        tag: 'The Highlight',
        title: 'Saturday\nOldies Night',
        description: 'A curated nostalgic journey through sound and soul. Every Saturday at 7:00 PM.',
        image: '',
        buttonLabel: 'Reserve Seat',
        subject: 'Seat Reservation: Oldies Night',
        order: 0,
        isActive: true,
    },
    {
        id: '__default_2',
        tag: '',
        title: 'Hotel Gastronomy',
        description: 'Discover the art of taste in our premium dining hall. From local organic secrets to global masterpieces.',
        image: '',
        buttonLabel: 'Reserve Table',
        subject: 'Table Reservation: Hotel Gastronomy',
        order: 1,
        isActive: true,
    },
    {
        id: '__default_3',
        tag: '',
        title: 'Elevated\nWorkspaces',
        description: 'Luxury office suites to let in the heart of the hotel grounds.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
        buttonLabel: 'Send Enquiry',
        subject: 'Viewing Request: Elevated Workspaces',
        order: 2,
        isActive: true,
    },
];

export default function JournalClient({
    initialPosts,
    hero,
    marketingCards: marketingCardsProp,
}: {
    initialPosts: Post[];
    hero?: HeroContent;
    marketingCards?: MarketingCard[];
}) {
    const heroLabel = hero?.label || 'Our Stories';
    const heroTitle = hero?.title || 'The Journal';
    const heroDescription = hero?.description || 'Stay updated with the latest happenings, exclusive offers, and stories from our haven.';
    // Fall back to hardcoded defaults when no cards are stored in the DB
    const marketingCards = (marketingCardsProp && marketingCardsProp.length > 0) ? marketingCardsProp : DEFAULT_MARKETING_CARDS;
    const [posts] = useState(initialPosts);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    // Form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formContext, setFormContext] = useState<{ subject: string, title: string, subtitle: string } | null>(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (selectedPost || isFormOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selectedPost, isFormOpen]);

    const handleOpenForm = (context: { subject: string, title: string, subtitle: string }) => {
        setFormContext(context);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setTimeout(() => setFormContext(null), 300); // Clear after animation
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error('Please fill in your name, email, and message.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    apartmentName: 'Journal Page', // Fallback identifier
                    subject: formContext?.subject || 'New Enquiry',
                }),
            });
            if (res.ok) {
                toast.success('Request sent! We will contact you shortly.');
                setForm({ name: '', email: '', phone: '', message: '' });
                handleCloseForm();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to send. Please try again.');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F5F0E6]">
            {/* Hero Section */}
            <section className="relative px-6 pt-24 pb-32 mb-20 overflow-hidden bg-[#0F2C23]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src={hero?.backgroundImage || 'https://images.unsplash.com/photo-1455391704245-2376bb74b358?auto=format&fit=crop&q=80'}
                        alt="Journal Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F2C23]/80 via-[#0F2C23]/60 to-[#F5F0E6]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto relative z-10 text-center"
                >
                    <span className="text-[#C9A05B] font-medium tracking-widest uppercase text-sm mb-4 block">{heroLabel}</span>
                    <h1 className="text-5xl md:text-7xl font-light text-white mb-6">{heroTitle}</h1>
                    <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        {heroDescription}
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
                                    {/* Button — centered below content */}
                                    <div className="mt-auto flex justify-center">
                                        <button
                                            onClick={() => setSelectedPost(post)}
                                            className={`flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 px-6 py-3 rounded-full group/btn ${isDark
                                                ? 'bg-white text-[#0F2C23] hover:bg-[#C9A05B] hover:text-white'
                                                : 'bg-[#0F2C23] text-white hover:bg-[#C9A05B]'
                                                }`}
                                        >
                                            Explore Story <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}

                    {/* Marketing Cards – rendered dynamically from admin */}
                    {marketingCards.map((card, idx) => {
                        const hasImage = !!card.image;
                        const isFirstCard = idx === 0;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className={`rounded-[40px] overflow-hidden shadow-xl group aspect-square ${hasImage ? 'relative' : isFirstCard
                                    ? 'bg-[#0F2C23] text-white p-10 relative flex flex-col justify-center'
                                    : 'bg-white p-10 flex flex-col border border-gray-100 hover:shadow-2xl transition-all duration-700'
                                    }`}
                            >
                                {hasImage ? (
                                    /* Photo background card (like Workspaces) */
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2C23]/90 to-transparent z-10 transition-all duration-700" />
                                        <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 z-20 p-10 flex flex-col justify-end pointer-events-none">
                                            <Building2 size={36} className="text-[#C9A05B] mb-5" />
                                            {card.tag && <span className="text-[#C9A05B] text-[10px] uppercase tracking-[0.3em] font-black block mb-2">{card.tag}</span>}
                                            <h3 className="text-2xl md:text-3xl font-light text-white mb-3 leading-tight">
                                                {card.title.split('\n').map((line, i, arr) => (
                                                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                                                ))}
                                            </h3>
                                            <p className="text-gray-200 text-sm font-light mb-8 max-w-[200px] leading-relaxed">{card.description}</p>
                                            <div className="mt-auto flex justify-center pointer-events-auto">
                                                <button
                                                    onClick={() => handleOpenForm({ subject: card.subject, title: card.buttonLabel, subtitle: card.title.replace(/\n/g, ' ') })}
                                                    className="flex items-center justify-center gap-3 text-[#0F2C23] text-[10px] font-black uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-full hover:bg-[#C9A05B] hover:text-white transition-all duration-500 shadow-xl group/btn"
                                                >
                                                    {card.buttonLabel} <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : isFirstCard ? (
                                    /* Dark highlight card (like Oldies Night) */
                                    <>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A05B]/20 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-[#C9A05B]/30 transition-all duration-700" />
                                        <Ticket size={40} className="text-[#C9A05B] mb-6" />
                                        {card.tag && <span className="text-[#C9A05B] text-[10px] uppercase tracking-[0.3em] font-black block mb-3">{card.tag}</span>}
                                        <h3 className="text-2xl md:text-3xl font-light mb-4 text-white leading-tight">
                                            {card.title.split('\n').map((line, i, arr) => (
                                                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                                            ))}
                                        </h3>
                                        <p className="text-gray-300 font-light text-sm md:text-base mb-8 leading-relaxed max-w-[280px]">{card.description}</p>
                                        <div className="mt-auto flex justify-center">
                                            <button
                                                onClick={() => handleOpenForm({ subject: card.subject, title: card.buttonLabel, subtitle: card.title.replace(/\n/g, ' ') })}
                                                className="flex items-center gap-3 text-[#0F2C23] font-bold text-[10px] uppercase tracking-widest bg-white hover:bg-[#C9A05B] hover:text-white transition-colors duration-500 px-6 py-3 rounded-full shadow-lg"
                                            >
                                                <Sparkles size={12} /> {card.buttonLabel}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* Light card (like Gastronomy) */
                                    <>
                                        <div className="w-14 h-14 bg-[#F5F0E6] rounded-[20px] flex items-center justify-center mb-6 text-[#0F2C23] group-hover:bg-[#C9A05B] group-hover:text-white transition-all duration-500 shrink-0">
                                            <Utensils size={28} />
                                        </div>
                                        {card.tag && <span className="text-[#C9A05B] text-[10px] uppercase tracking-[0.2em] font-black block mb-2">{card.tag}</span>}
                                        <h3 className="text-2xl font-light text-[#0F2C23] mb-4 tracking-tight group-hover:text-[#C9A05B] transition-colors">
                                            {card.title.split('\n').map((line, i, arr) => (
                                                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                                            ))}
                                        </h3>
                                        <p className="text-gray-500 font-light text-sm md:text-base mb-8 leading-relaxed flex-1 overflow-hidden">{card.description}</p>
                                        <div className="mt-auto flex justify-center">
                                            <button
                                                onClick={() => handleOpenForm({ subject: card.subject, title: card.buttonLabel, subtitle: card.title.replace(/\n/g, ' ') })}
                                                className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] bg-[#0F2C23] px-6 py-3 rounded-full hover:bg-[#C9A05B] transition-all duration-500 shadow-sm group/btn"
                                            >
                                                {card.buttonLabel} <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
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

                {/* Sliding Form Canvas */}
                {isFormOpen && formContext && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="form-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                            onClick={handleCloseForm}
                        />
                        {/* Sliding Canvas */}
                        <motion.div
                            key="form-canvas"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
                            className="fixed top-0 right-0 h-full w-full max-w-md z-[70] bg-[#0F2C23] shadow-2xl flex flex-col overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0F2C23] z-10">
                                <div>
                                    <p className="text-[#C9A05B] text-xs font-bold uppercase tracking-widest">{formContext.subtitle}</p>
                                    <h2 className="text-2xl font-light text-white">{formContext.title}</h2>
                                </div>
                                <button
                                    onClick={handleCloseForm}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                                    <div className="space-y-4 flex-1">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 uppercase tracking-widest">Full Name *</label>
                                            <Input
                                                placeholder="John Doe"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                required
                                                suppressHydrationWarning
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#C9A05B]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 uppercase tracking-widest">Email Address *</label>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                required
                                                suppressHydrationWarning
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#C9A05B]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 uppercase tracking-widest">Phone Number</label>
                                            <Input
                                                placeholder="+256 000 000 000"
                                                value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                                suppressHydrationWarning
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#C9A05B]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 uppercase tracking-widest">Message / Notes *</label>
                                            <Textarea
                                                placeholder="Tell us what you're interested in..."
                                                value={form.message}
                                                onChange={e => setForm({ ...form, message: e.target.value })}
                                                rows={4}
                                                required
                                                suppressHydrationWarning
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-[#C9A05B] resize-none"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[#C9A05B] hover:bg-white disabled:opacity-60 text-[#0F2C23] h-14 rounded-full text-sm font-bold uppercase tracking-widest transition-colors duration-500 mt-auto shadow-lg"
                                    >
                                        {submitting ? 'Sending Request…' : 'Submit Request'}
                                    </button>
                                </form>
                                <p className="text-[11px] text-center text-gray-400 mt-6 font-light leading-relaxed">
                                    Your enquiry will be sent to our official desk. You will hear back from us typically within 2 hours.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

