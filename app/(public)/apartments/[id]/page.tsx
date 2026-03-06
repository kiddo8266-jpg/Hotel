import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ApartmentDetailClient from './ApartmentDetailClient';

export default async function ApartmentDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    const [apartment, settings] = await Promise.all([
        prisma.apartment.findUnique({
            where: { id },
            include: { amenities: true },
        }),
        prisma.siteSetting.findUnique({
            where: { id: 'main' },
            select: { contactEmail: true, contactPhone: true, bookingLink: true },
        }),
    ]);

    if (!apartment) {
        notFound();
    }

    return (
        <ApartmentDetailClient
            apartment={apartment}
            contactEmail={settings?.contactEmail || 'info@josehotel.com'}
            contactPhone={settings?.contactPhone || '0772560696'}
            bookingLink={settings?.bookingLink || ''}
        />
    );
}
