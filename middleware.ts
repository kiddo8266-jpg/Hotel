// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'supersecretjwtkeyforjosephinehaven';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname;

    // Protect all /admin routes (except /admin/login)
    if (url.startsWith('/admin') && url !== '/admin/login') {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            // No token → redirect to login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            // Verify JWT
            const decoded = verify(token, secret) as { userId: string; role: string };

            // Only allow admins
            if (decoded.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Valid admin → proceed
            return NextResponse.next();
        } catch (err) {
            // Invalid/expired token → redirect to login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // For all other routes → continue normally
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'], // Applies only to /admin and subpaths
};