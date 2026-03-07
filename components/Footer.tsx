import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function Footer() {
    const [settings, footerLinks] = await Promise.all([
        prisma.siteSetting.findUnique({ where: { id: 'main' } }),
        prisma.navigationLink.findMany({
            where: { isHeader: false, isActive: true },
            orderBy: { order: 'asc' },
            select: { href: true, label: true }
        })
    ]);

    const hotelName = settings?.hotelName || "NL Josephine's Hotel";
    const phone = settings?.contactPhone || '0772560696';
    const email = settings?.contactEmail || 'nljosephine2025@gmail.com';
    const address = settings?.address || 'Seguku, Entebbe Road\nKampala, Uganda';
    const facebookUrl = settings?.facebookUrl || 'https://facebook.com';
    const instagramUrl = settings?.instagramUrl || 'https://instagram.com';
    const twitterUrl = settings?.twitterUrl || 'https://twitter.com';
    const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com';
    const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com';
    const logoUrl = settings?.logoUrl || '';
    const logoAlt = settings?.logoAlt || "NL Josephine's Hotel Logo";

    const addressLines = address.replace(/\\n/g, '\n').split('\n');

    return (
        <footer className="bg-[#163C2E] text-gray-400 py-16 border-t border-[#C9A05B]/10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
                <div className="md:col-span-4 space-y-6">
                    <div>
                        <Link href="/" className="inline-flex flex-col gap-1 mb-8 group">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 relative">
                                    <div className="absolute inset-0 bg-[#C9A05B] rounded-full blur-xl opacity-20" />
                                    <img
                                        src={logoUrl || 'https://cdn-icons-png.flaticon.com/512/2983/2983803.png'}
                                        alt={logoAlt}
                                        className="relative z-10 w-full h-full object-contain"
                                    />

                                </div>
                                <span className="text-white font-serif text-xl md:text-2xl tracking-wider uppercase group-hover:text-[#C9A05B] transition-colors duration-500">
                                    {hotelName}
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-400 font-light leading-relaxed mb-8 max-w-sm">
                            {settings?.footerDescription || "Experience quiet luxury and uncompromising comfort. Your serene home away from home in the heart of Seguku."}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                                <span className="text-[#C9A05B] text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {settings?.footerBadge || "A Haven"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Navigation</h4>
                    <ul className="space-y-4">
                        {footerLinks.map((link: { href: string; label: string }) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-sm font-light hover:text-[#C9A05B] transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Connect</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4 group">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C9A05B] transition-colors duration-300 shadow-[0_0_0_transparent] group-hover:shadow-[0_0_15px_#C9A05B60]">
                                <Phone size={14} className="text-[#C9A05B] group-hover:text-[#163C2E] transition-colors" />
                            </span>
                            <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm font-light text-gray-300 hover:text-[#C9A05B] transition-colors">{phone}</a>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C9A05B] transition-colors duration-300 shadow-[0_0_0_transparent] group-hover:shadow-[0_0_15px_#C9A05B60]">
                                <Mail size={14} className="text-[#C9A05B] group-hover:text-[#163C2E] transition-colors" />
                            </span>
                            <a href={`mailto:${email}`} className="text-sm font-light text-gray-300 hover:text-[#C9A05B] transition-colors">{email}</a>
                        </li>
                        <li className="flex items-start gap-4 group mt-2">
                            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#C9A05B] transition-colors duration-300 shadow-[0_0_0_transparent] group-hover:shadow-[0_0_15px_#C9A05B60]">
                                <MapPin size={14} className="text-[#C9A05B] group-hover:text-[#163C2E] transition-colors" />
                            </span>
                            <span className="text-sm font-light text-gray-300 leading-relaxed pt-1">
                                {addressLines.map((line: string, i: number) => (
                                    <span key={i}>{line}{i < addressLines.length - 1 && <br />}</span>
                                ))}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Social</h4>
                    <div className="flex flex-wrap gap-3">
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#163C2E] hover:-translate-y-1 hover:shadow-[0_0_20px_#C9A05B80] transition-all duration-300 group">
                            <Facebook size={16} className="text-gray-400 group-hover:text-[#163C2E] transition-colors" />
                        </a>
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#163C2E] hover:-translate-y-1 hover:shadow-[0_0_20px_#C9A05B80] transition-all duration-300 group">
                            <Instagram size={16} className="text-gray-400 group-hover:text-[#163C2E] transition-colors" />
                        </a>
                        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#163C2E] hover:-translate-y-1 hover:shadow-[0_0_20px_#C9A05B80] transition-all duration-300 group">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="text-gray-400 group-hover:text-[#163C2E] transition-colors">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#163C2E] hover:-translate-y-1 hover:shadow-[0_0_20px_#C9A05B80] transition-all duration-300 group">
                            <Youtube size={16} className="text-gray-400 group-hover:text-[#163C2E] transition-colors" />
                        </a>
                        <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#C9A05B] hover:text-[#163C2E] hover:-translate-y-1 hover:shadow-[0_0_20px_#C9A05B80] transition-all duration-300 group">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="text-gray-400 group-hover:text-[#163C2E] transition-colors">
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
