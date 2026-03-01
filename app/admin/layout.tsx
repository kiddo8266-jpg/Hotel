import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import AdminSidebar from './AdminSidebar';

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
            <AdminSidebar />
            {/* Hamburger spacer on mobile */}
            <main className="flex-1 md:ml-64 p-6 md:p-10">
                {children}
            </main>
        </div>
    );
}
