import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Unsupported file type: ${file.type}. Allowed types: JPEG, PNG, GIF, WebP, MP4, WebM` },
                { status: 400 }
            );
        }

        const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File too large. Max size: ${file.type.startsWith('video/') ? '50MB' : '10MB'}` },
                { status: 400 }
            );
        }

        const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
        const safeFilename = `${randomUUID()}.${ext}`;
        const blob = await put(safeFilename, file, {
            access: 'public',
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
