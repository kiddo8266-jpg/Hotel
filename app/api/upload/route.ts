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
        let buffer = Buffer.from(bytes as ArrayBuffer) as unknown as Buffer;

        // Auto upscale/enhance images if they are considered "low resolution"
        if (file.type.startsWith('image/')) {
            try {
                const imageInfo = sharp(buffer);
                const metadata = await imageInfo.metadata();

                // Define low resolution threshold (e.g., width or height < 1200px)
                if (metadata.width && metadata.height && (metadata.width < 1200 || metadata.height < 1200)) {
                    // Try to use Replicate to AI upscale if token is available
                    if (process.env.REPLICATE_API_TOKEN) {
                        try {
                            const Replicate = (await import('replicate')).default;
                            const replicate = new Replicate({
                                auth: process.env.REPLICATE_API_TOKEN,
                            });

                            // Convert buffer to base64 data URI to send to Replicate
                            const mimeType = metadata.format === 'jpeg' ? 'image/jpeg' :
                                metadata.format === 'png' ? 'image/png' :
                                    metadata.format === 'webp' ? 'image/webp' : file.type;
                            const base64Data = buffer.toString('base64');
                            const dataUri = `data:${mimeType};base64,${base64Data}`;

                            console.log('Sending low-res image to Replicate ESRGAN for upscaling...');
                            const output = (await replicate.run(
                                "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
                                {
                                    input: {
                                        image: dataUri,
                                        scale: 2, // 2x upscale
                                        face_enhance: false // usually false for room/hotel shots
                                    }
                                }
                            )) as unknown as string;

                            // Fetch the upscaled image from the returned Replicate URL
                            if (output) {
                                console.log('Successfully received upscaled image from Replicate.');
                                const upscaledRes = await fetch(output);
                                if (upscaledRes.ok) {
                                    const upscaledArrayBuffer = await upscaledRes.arrayBuffer();
                                    buffer = Buffer.from(upscaledArrayBuffer) as unknown as Buffer;
                                }
                            }
                        } catch (repError) {
                            console.error('Replicate API error, falling back to basic sharp resize:', repError);
                            // Fallback to basic sharp resizing
                            buffer = await imageInfo
                                .resize({
                                    width: 1200,
                                    height: 1200,
                                    fit: 'outside',
                                    withoutEnlargement: false
                                })
                                .toBuffer();
                        }
                    } else {
                        // Replicate token not present, do basic sharp upscale
                        buffer = await imageInfo
                            .resize({
                                width: 1200,
                                height: 1200,
                                fit: 'outside',
                                withoutEnlargement: false
                            })
                            .toBuffer();
                    }
                }
            } catch (imageError) {
                console.error('Image processing error:', imageError);
                // Continue with original buffer if processing fails
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
