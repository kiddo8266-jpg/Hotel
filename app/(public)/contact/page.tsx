import { prisma } from '@/lib/prisma';
import ContactClient from './ContactClient';

export default async function ContactPage() {
    const settings = (await prisma.siteSetting.findUnique({
        where: { id: 'main' }
    })) as any;

    return (
        <ContactClient
            heroImage={settings?.contactHeroImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'}
        />
    );
}
