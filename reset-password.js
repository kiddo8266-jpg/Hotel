const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
    // 1. Change these values to match your admin email and desired new password
    const adminEmail = 'admin@josehotel.com';
    const newPassword = 'NewPassword123!';

    try {
        // 2. Hash the new password securely
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update the user in the database
        const user = await prisma.user.update({
            where: { email: adminEmail },
            data: { password: hashedPassword },
        });

        console.log(`✅ Password successfully reset for user: ${user.email}`);
        console.log(`🔑 New password is: ${newPassword}`);

    } catch (error) {
        if (error.code === 'P2025') {
            console.error(`❌ Error: No user found with the email "${adminEmail}"`);
        } else {
            console.error('❌ An unexpected error occurred:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
