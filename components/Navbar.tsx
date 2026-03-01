'use client';
import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#0F2C23]/10">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#0F2C23] rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-light">J</span>
                    </div>
                    <div>
                        <span className="text-2xl font-light tracking-tight text-[#0F2C23]">Josephine Haven</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-widest">
                    <Link href="/" className="hover:text-[#C9A05B] transition-colors">Home</Link>
                    <Link href="/apartments" className="hover:text-[#C9A05B] transition-colors">Apartments</Link>
                    <Link href="/gallery" className="hover:text-[#C9A05B] transition-colors">Gallery</Link>
                    <Link href="/blog" className="hover:text-[#C9A05B] transition-colors">Journal</Link>
                    <Link href="/about" className="hover:text-[#C9A05B] transition-colors">About</Link>
                    <Link href="/contact" className="hover:text-[#C9A05B] transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="flex flex-col py-6 px-6 space-y-6 text-lg">
                        <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link href="/apartments" onClick={() => setIsOpen(false)}>Apartments</Link>
                        <Link href="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
                        <Link href="/blog" onClick={() => setIsOpen(false)}>Journal</Link>
                        <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
                        <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}