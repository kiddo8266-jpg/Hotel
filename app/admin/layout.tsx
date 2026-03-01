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
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0F2C23] text-white fixed h-full flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-serif font-bold text-[#C9A05B]">Admin Area</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="block p-3 rounded hover:bg-white/10 transition">
                        Dashboard / Settings
                    </Link>
                    <Link href="/admin/apartments" className="block p-3 rounded hover:bg-white/10 transition">
                        Apartments
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/" className="block p-3 rounded hover:bg-white/10 transition">
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 p-10 bg-gray-50/50">
                {children}
            </main>
        </div>
    );
}
