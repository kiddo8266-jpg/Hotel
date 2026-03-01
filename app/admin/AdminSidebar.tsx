'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Building2,
    FileText,
    Image,
    Settings,
    ArrowLeft,
    User,
    Menu,
    X,
} from 'lucide-react';

const navLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { href: '/admin/apartments', icon: Building2, label: 'Apartments', exact: false },
    { href: '/admin/blog', icon: FileText, label: 'Blog / News', exact: false },
    { href: '/admin/gallery', icon: Image, label: 'Gallery', exact: false },
    { href: '/admin/settings', icon: Settings, label: 'Site Settings', exact: false },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-[#0F2C23] text-white"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
            >
                <Menu size={20} />
            </button>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`w-64 bg-[#0F2C23] text-white fixed h-full flex flex-col z-40 transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                {/* Close button (mobile only) */}
                <button
                    className="md:hidden absolute top-4 right-4 p-1 text-white/60 hover:text-white"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Building2 size={20} className="text-[#C9A05B]" />
                        <h2 className="text-lg font-serif font-bold text-[#C9A05B]">Josephine Haven</h2>
                    </div>
                    <p className="text-xs text-white/50 mt-1 ml-7">Admin Panel</p>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navLinks.map(({ href, icon: Icon, label, exact }) => {
                        const active = isActive(href, exact);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 p-3 rounded no-underline transition text-sm font-medium
                                    ${active
                                        ? 'border-l-2 border-[#C9A05B] bg-white/10 text-[#C9A05B]'
                                        : 'text-white/80 hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info */}
                <div className="px-4 py-3 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C9A05B]/20 text-[#C9A05B] flex items-center justify-center flex-shrink-0">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Admin</p>
                            <p className="text-xs text-white/50">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Back to site */}
                <div className="p-4 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center gap-2 no-underline p-3 rounded bg-[#C9A05B]/10 hover:bg-[#C9A05B]/20 text-[#C9A05B] transition font-medium text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Site
                    </Link>
                </div>
            </aside>
        </>
    );
}
