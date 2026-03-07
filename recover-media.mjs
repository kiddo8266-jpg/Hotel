import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
        console.log("No uploads directory found.");
        return;
    }

    const files = fs.readdirSync(uploadsDir);
    let recoveredCount = 0;

    console.log(`Found ${files.length} files in public/uploads. Ensuring they exist in the Media gallery...`);

    let markdownContent = `# Recovered Images Guide\n\nThe following images were recovered from your \`public/uploads\` folder. You can use these URLs in the Admin panel to reassign images to your accommodations, amenities, and blog posts.\n\n`;

    // Process each file
    for (const file of files) {
        // Skip non-image files if needed, but let's just include common ones
        if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) continue;

        const url = `/uploads/${file}`;
        markdownContent += `### ${file}\n`;
        markdownContent += `**URL:** \`${url}\`\n\n`;
        markdownContent += `<img src="${url}" width="300" style="border-radius: 8px; margin-bottom: 20px" />\n\n`;
        markdownContent += `---\n\n`;

        // Check if it's already in the Media table
        const existing = await prisma.media.findFirst({
            where: { url }
        });

        if (!existing) {
            await prisma.media.create({
                data: {
                    url,
                    type: 'image',
                    alt: `Recovered image ${file}`,
                    section: 'recovery',
                    area: 'unassigned'
                }
            });
            recoveredCount++;
        }
    }

    // Write the visual guide to the public folder so the user can view it in the browser if they want,
    // or just in the project root. Let's write it to the project root.
    fs.writeFileSync(path.join(process.cwd(), 'recovered_images_guide.md'), markdownContent);

    console.log(`Added ${recoveredCount} missing images to the Media gallery database.`);
    console.log(`Generated 'recovered_images_guide.md' for your convenience.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
