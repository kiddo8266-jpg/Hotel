import { prisma } from '@/lib/prisma';
import GalleryPageClient from './GalleryPageClient';

export default async function GalleryPage() {
    const galleryItems = await prisma.media.findMany({
        where: { section: 'gallery' },
        orderBy: { createdAt: 'desc' },
    });

    return <GalleryPageClient items={galleryItems} />;
}
