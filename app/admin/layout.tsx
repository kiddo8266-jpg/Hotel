import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforjosephinehaven';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
        redirect('/login');
    }

    try {
        // Basic verification - since it's a server component we can verify
        jwt.verify(token, JWT_SECRET);
    } catch (error) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0F2C23] text-white fixed h-full flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-serif font-bold text-[#C9A05B]">Admin Area</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="block no-underline p-3 rounded hover:bg-white/10 transition">
                        Dashboard
                    </Link>
                    <Link href="/admin/apartments" className="block no-underline p-3 rounded hover:bg-white/10 transition">
                        Apartments
                    </Link>
                    <Link href="/admin/blog" className="block no-underline p-3 rounded hover:bg-white/10 transition">
                        Blog / News
                    </Link>
                    <Link href="/admin/gallery" className="block no-underline p-3 rounded hover:bg-white/10 transition">
                        Gallery
                    </Link>
                    <Link href="/admin/settings" className="block no-underline p-3 rounded hover:bg-white/10 transition">
                        Site Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/" className="block no-underline p-3 rounded bg-[#C9A05B]/10 hover:bg-[#C9A05B]/20 text-[#C9A05B] transition font-medium">
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 p-10">
                {children}
            </main>
        </div>
    );
}
