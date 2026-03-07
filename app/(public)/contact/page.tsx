import { prisma } from '@/lib/prisma';
import ContactClient from './ContactClient';

export default async function ContactPage() {
    const settings = (await prisma.siteSetting.findUnique({
        where: { id: 'main' }
    })) as any;

    return (
        <ContactClient
            heroImage={settings?.contactHeroImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'}
            heroLabel={settings?.contactHeroLabel}
            heroTitle={settings?.contactHeroTitle}
            heroDescription={settings?.contactHeroDescription}
            formHeading={settings?.contactFormHeading}
            formDescription={settings?.contactFormDescription}
            contactMapUrl={settings?.contactMapUrl}
            contactHoursWeekday={settings?.contactHoursWeekday}
            contactHoursSaturday={settings?.contactHoursSaturday}
            contactHoursSunday={settings?.contactHoursSunday}
            contactHoursReception={settings?.contactHoursReception}
            contactCallHeading={settings?.contactCallHeading}
            contactCallDescription={settings?.contactCallDescription}
            contactPhone={settings?.contactPhone}
            contactEmail={settings?.contactEmail}
            address={settings?.address}
            contactCallButtonText={settings?.contactCallButtonText}
            contactCallButtonLink={settings?.contactCallButtonLink}
        />
    );
}
