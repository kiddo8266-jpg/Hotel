import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname;

    // Protect all /admin routes
    if (url.startsWith('/admin')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            // No token → redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // A lightweight check in Edge runtime (secure verification is done in layout.tsx)
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Only allow admins
            if (payload.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Valid admin → proceed
            return NextResponse.next();
        } catch (err) {
            // Invalid/expired token format → redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // For all other routes → continue normally
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'], // Applies only to /admin and subpaths
};