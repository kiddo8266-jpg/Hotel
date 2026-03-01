import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0F2C23] text-gray-300 py-12 border-t border-[#C9A05B]/20">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <h3 className="text-2xl font-serif text-[#C9A05B]">NL Josephine's</h3>
                    <p className="text-sm leading-relaxed">
                        Experience quiet luxury at NL Josephine’s Apartments. Your serene home away from home in Seguku.
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><Link href="/" className="hover:text-[#C9A05B] transition-colors">Home</Link></li>
                        <li><Link href="/suites" className="hover:text-[#C9A05B] transition-colors">Suites</Link></li>
                        <li><Link href="/services" className="hover:text-[#C9A05B] transition-colors">Services</Link></li>
                        <li><Link href="/about" className="hover:text-[#C9A05B] transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-[#C9A05B] transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Contact Us</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-[#C9A05B]" />
                            <span>0772560696</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-[#C9A05B]" />
                            <span>info@josephinehaven.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin size={18} className="text-[#C9A05B] mt-1 shrink-0" />
                            <span>Seguku, Entebbe Road<br />Kampala, Uganda</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Follow Us</h4>
                    <div className="flex gap-4">
                        <a href="#" aria-label="Facebook" className="p-2 bg-white/5 rounded-full hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all">
                            <Facebook size={20} />
                        </a>
                        <a href="#" aria-label="Instagram" className="p-2 bg-white/5 rounded-full hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all">
                            <Instagram size={20} />
                        </a>
                        <a href="#" aria-label="X (Twitter)" className="p-2 bg-white/5 rounded-full hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="YouTube" className="p-2 bg-white/5 rounded-full hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all">
                            <Youtube size={20} />
                        </a>
                        <a href="#" aria-label="TikTok" className="p-2 bg-white/5 rounded-full hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} NL Josephine's Apartments. All rights reserved.</p>
            </div>
        </footer>
    );
}
