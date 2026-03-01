import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

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

        const bytes = await file.arrayBuffer();
        let buffer = Buffer.from(bytes as ArrayBuffer);

        // Auto upscale images to 1080px if they are smaller
        if (file.type.startsWith('image/')) {
            try {
                const image = sharp(buffer);
                const metadata = await image.metadata();

                if (metadata.width && metadata.height && (metadata.width < 1080 || metadata.height < 1080)) {
                    buffer = await image
                        .resize({
                            width: 1080,
                            height: 1080,
                            fit: 'outside',
                            withoutEnlargement: false
                        })
                        .toBuffer();
                }
            } catch (imageError) {
                console.error('Image processing error:', imageError);
                // Continue with original buffer if sharp fails
            }
        }

        const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
        const filename = `${randomUUID()}.${ext}`;

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        await writeFile(join(uploadDir, filename), buffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
