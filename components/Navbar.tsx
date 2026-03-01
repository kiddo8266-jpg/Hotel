'use client';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const bookNowClass = 'flex items-center gap-2 relative overflow-hidden bg-gradient-to-r from-[#C9A05B] to-[#D4B06A] text-[#0F2C23] font-semibold text-sm uppercase tracking-widest py-2.5 px-6 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(201,160,91,0.3)] hover:shadow-[0_0_30px_rgba(201,160,91,0.5)] hover:scale-105 active:scale-95 group';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/apartments', label: 'Apartments' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'Journal' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md border-b border-[#0F2C23]/10 shadow-sm'
                    : 'bg-transparent border-b border-white/10'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${scrolled ? 'bg-[#0F2C23]' : 'bg-white/20 backdrop-blur-sm'}`}>
                        <span className="text-[#C9A05B] text-xl font-light">J</span>
                    </div>
                    <div>
                        <span className={`text-2xl font-light tracking-tight transition-colors duration-500 ${scrolled ? 'text-[#0F2C23]' : 'text-white'}`}>
                            Josephine Haven
                        </span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-widest">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`py-1 transition-colors duration-300 ${
                                    scrolled
                                        ? isActive ? 'text-[#C9A05B]' : 'text-[#0F2C23] hover:text-[#C9A05B]'
                                        : isActive ? 'text-[#C9A05B]' : 'text-white hover:text-[#C9A05B]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    {/* Book Now CTA — desktop */}
                    <Link
                        href="/contact"
                        className={`hidden md:flex ${bookNowClass}`}
                    >
                        <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                        <Phone size={15} className="transition-transform duration-300 group-hover:rotate-12" />
                        Book Now
                    </Link>

                    {/* Hamburger — mobile */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                            scrolled ? 'bg-[#0F2C23]/10 text-[#0F2C23]' : 'bg-white/20 text-white'
                        }`}
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isOpen ? (
                                <motion.span
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={22} />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="open"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={22} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Slide-in panel */}
                        <motion.div
                            key="panel"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
                            className="fixed top-0 right-0 h-full w-72 z-50 bg-[#0F2C23] flex flex-col py-8 px-6 shadow-2xl md:hidden"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-white text-lg font-light tracking-tight">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/70 hover:text-white transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-2 flex-1">
                                {navLinks.map((link, i) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i, duration: 0.3 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-widest transition-all duration-200 ${
                                                    isActive
                                                        ? 'border-l-2 border-[#C9A05B] text-[#C9A05B] bg-white/5 pl-3'
                                                        : 'text-white/80 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </nav>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.3 }}
                            >
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className={`justify-center ${bookNowClass}`}
                                >
                                    <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                                    <Phone size={15} />
                                    Book Now
                                </Link>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}