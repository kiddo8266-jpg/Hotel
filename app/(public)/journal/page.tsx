import JournalClient from './JournalClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPosts() {
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                published: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
}

export const metadata = {
    title: 'Journal | Josephine Haven',
    description: 'Latest news, events, and stories from Josephine Haven.',
};

export default async function JournalPage() {
    const posts = await getPosts();
    return <JournalClient initialPosts={posts} />;
}
