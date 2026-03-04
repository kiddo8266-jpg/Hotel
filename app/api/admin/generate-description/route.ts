import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('admin_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev');
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API Key is not configured in .env.local' }, { status: 500 });
        }

        const { title, type, features, imageUrl } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Title is required for context.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let imageParts: Array<{ inlineData: { data: string, mimeType: string } }> = [];

        if (imageUrl) {
            try {
                // Determine absolute URL
                const absoluteUrl = imageUrl.startsWith('http')
                    ? imageUrl
                    : `${req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${imageUrl}`;

                const imageResp = await fetch(absoluteUrl);
                if (imageResp.ok) {
                    const buffer = await imageResp.arrayBuffer();
                    const base64Image = Buffer.from(buffer).toString('base64');
                    const mimeType = imageResp.headers.get('content-type') || 'image/jpeg';

                    imageParts.push({
                        inlineData: {
                            data: base64Image,
                            mimeType
                        }
                    });
                }
            } catch (err) {
                console.warn('Could not fetch image for AI context:', err);
                // Continue without image; AI will just use the text.
            }
        }

        const prompt = `
            You are an expert luxury hotel copywriter writing a captivating description for a high-end hotel room/apartment.
            
            Context details:
            - Title: ${title}
            - Type: ${type || 'Luxury Suite'}
            - Key Features/Amenities: ${features || 'Premium amenities included'}
            
            Instructions:
            1. Write a beautifully crafted, engaging 2-3 paragraph description for this room.
            2. Focus on the feeling of luxury, comfort, and exclusivity.
            3. Highlight the provided features naturally in the text.
            4. If an image is provided, describe the ambiance and style visible in the photo.
            5. Output the response in clean, semantic HTML format (using <p>, <strong>, <ul>, <li> tags as appropriate). Do NOT include any markdown code blocks like \`\`\`html or \`\`\`, just the raw HTML code so it can be injected directly into a rich text editor.
        `;

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = result.response;
        let htmlContent = response.text();

        // Cleanup any accidental markdown wrapping
        htmlContent = htmlContent.replace(/^```html|```$/gm, '').trim();

        return NextResponse.json({ content: htmlContent });
    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate description' }, { status: 500 });
    }
}
