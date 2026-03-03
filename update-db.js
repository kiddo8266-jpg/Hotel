const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDB() {
    const currentSettings = await prisma.siteSetting.findFirst();
    if (currentSettings) {
        const newHeroTitle = currentSettings.heroTitle.replace(/Josephine Haven/g, "NL Josephine's Hotel");
        const newAboutText = currentSettings.aboutText.replace(/NL Josephine’s Apartments/g, "NL Josephine's Hotel").replace(/NL Josephine's Apartments/g, "NL Josephine's Hotel").replace(/Josephine Haven/g, "NL Josephine's Hotel");
        const newAboutStory = currentSettings.aboutStory.replace(/Josephine Haven/g, "NL Josephine's Hotel").replace(/NL Josephine's Apartments/g, "NL Josephine's Hotel").replace(/NL Josephine’s Apartments/g, "NL Josephine's Hotel");

        await prisma.siteSetting.update({
            where: { id: currentSettings.id },
            data: {
                heroTitle: newHeroTitle,
                aboutText: newAboutText,
                aboutStory: newAboutStory
            }
        });
        console.log("Updated SiteSettings!");
    }

    // Check Apartments
    const apartments = await prisma.apartment.findMany();
    for (const apt of apartments) {
        let changed = false;
        let description = apt.description;
        if (description.includes("Josephine Haven") || description.includes("NL Josephine’s Apartments") || description.includes("NL Josephine's Apartments")) {
            description = description.replace(/Josephine Haven/g, "NL Josephine's Hotel")
                .replace(/NL Josephine’s Apartments/g, "NL Josephine's Hotel")
                .replace(/NL Josephine's Apartments/g, "NL Josephine's Hotel");
            changed = true;
        }
        if (changed) {
            await prisma.apartment.update({
                where: { id: apt.id },
                data: { description }
            });
            console.log(`Updated Apartment: ${apt.title}`);
        }
    }

    // Check BlogPosts
    const blogPosts = await prisma.blogPost.findMany();
    for (const post of blogPosts) {
        let changed = false;
        let content = post.content;
        if (content.includes("Josephine Haven") || content.includes("NL Josephine’s Apartments") || content.includes("NL Josephine's Apartments")) {
            content = content.replace(/Josephine Haven/g, "NL Josephine's Hotel")
                .replace(/NL Josephine’s Apartments/g, "NL Josephine's Hotel")
                .replace(/NL Josephine's Apartments/g, "NL Josephine's Hotel");
            changed = true;
        }
        if (changed) {
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { content }
            });
            console.log(`Updated BlogPost: ${post.title}`);
        }
    }

}

updateDB()
    .then(() => console.log('Done'))
    .catch(console.error)
    .finally(() => prisma.$disconnect());
