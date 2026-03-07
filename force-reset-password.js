const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log("Current users in DB:", users);

        if (users.length > 0) {
            const adminEmail = users[0].email;
            const newPassword = 'admin'; // Easy to type, they can change it later or we just set it to admin123.
            // Wait, let's just set it to admin123
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await prisma.user.update({
                where: { email: adminEmail },
                data: { password: hashedPassword }
            });
            console.log(`✅ Password successfully reset for user: ${adminEmail}`);
            console.log(`🔑 New password is: admin123`);
        } else {
            console.log("No users found in the database. Creating one...");
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await prisma.user.create({
                data: {
                    email: "admin@josehotel.com",
                    password: hashedPassword,
                    name: "Admin",
                    role: "admin"
                }
            });
            console.log("✅ Created admin@josehotel.com with password: admin123");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
