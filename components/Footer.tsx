import Link from 'next/link';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

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
                        <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all">
                            <Twitter size={20} />
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
