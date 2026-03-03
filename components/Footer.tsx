import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function Footer() {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });

    const hotelName = settings?.hotelName || "NL Josephine's Hotel";
    const phone = settings?.contactPhone || '0772560696';
    const email = settings?.contactEmail || 'info@josehotel.com';
    const address = settings?.address || 'Seguku, Entebbe Road\nKampala, Uganda';
    const facebookUrl = settings?.facebookUrl || 'https://facebook.com';
    const instagramUrl = settings?.instagramUrl || 'https://instagram.com';
    const twitterUrl = settings?.twitterUrl || 'https://twitter.com';
    const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com';
    const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com';

    const addressLines = address.replace(/\\n/g, '\n').split('\n');

    return (
        <footer className="bg-[#0F2C23] text-gray-400 py-16 border-t border-[#C9A05B]/10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
                <div className="md:col-span-4 space-y-6">
                    <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-2 backdrop-blur-md">
                        A Sanctuary
                    </span>
                    <h3 className="text-3xl font-light text-white font-serif italic mb-4">{hotelName}</h3>
                    <p className="text-sm font-light leading-relaxed text-gray-300 max-w-sm">
                        Experience quiet luxury and uncompromising comfort. Your serene home away from home in the heart of Seguku.
                    </p>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Navigation</h4>
                    <ul className="space-y-4">
                        <li><Link href="/" className="text-sm font-light hover:text-[#C9A05B] transition-colors">The Sanctuary</Link></li>
                        <li><Link href="/apartments" className="text-sm font-light hover:text-[#C9A05B] transition-colors">The Collection</Link></li>
                        <li><Link href="/services" className="text-sm font-light hover:text-[#C9A05B] transition-colors">Services</Link></li>
                        <li><Link href="/about" className="text-sm font-light hover:text-[#C9A05B] transition-colors">Our Heritage</Link></li>
                        <li><Link href="/journal" className="text-sm font-light hover:text-[#C9A05B] transition-colors">The Journal</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Connect</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4 group">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C9A05B] transition-colors duration-300">
                                <Phone size={14} className="text-[#C9A05B] group-hover:text-[#0F2C23] transition-colors" />
                            </span>
                            <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm font-light text-gray-300 hover:text-[#C9A05B] transition-colors">{phone}</a>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C9A05B] transition-colors duration-300">
                                <Mail size={14} className="text-[#C9A05B] group-hover:text-[#0F2C23] transition-colors" />
                            </span>
                            <a href={`mailto:${email}`} className="text-sm font-light text-gray-300 hover:text-[#C9A05B] transition-colors">{email}</a>
                        </li>
                        <li className="flex items-start gap-4 group mt-2">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#C9A05B] transition-colors duration-300">
                                <MapPin size={14} className="text-[#C9A05B] group-hover:text-[#0F2C23] transition-colors" />
                            </span>
                            <span className="text-sm font-light text-gray-300 leading-relaxed pt-1">
                                {addressLines.map((line, i) => (
                                    <span key={i}>{line}{i < addressLines.length - 1 && <br />}</span>
                                ))}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Social</h4>
                    <div className="flex flex-wrap gap-3">
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all duration-300 group">
                            <Facebook size={16} className="text-gray-400 group-hover:text-[#0F2C23] transition-colors" />
                        </a>
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all duration-300 group">
                            <Instagram size={16} className="text-gray-400 group-hover:text-[#0F2C23] transition-colors" />
                        </a>
                        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all duration-300 group">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="text-gray-400 group-hover:text-[#0F2C23] transition-colors">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all duration-300 group">
                            <Youtube size={16} className="text-gray-400 group-hover:text-[#0F2C23] transition-colors" />
                        </a>
                        <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#0F2C23] transition-all duration-300 group">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="text-gray-400 group-hover:text-[#0F2C23] transition-colors">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} {hotelName}. All rights reserved.</p>
            </div>
        </footer>
    );
}
