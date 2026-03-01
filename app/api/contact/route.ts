import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
        }

        // 1. Save to Database
        const enquiry = await prisma.enquiry.create({
            data: {
                name,
                email,
                phone,
                subject: subject || 'New Enquiry',
                message,
            },
        });

        // 2. Send Email Notification
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: `"NL Josephine's Hotel" <${process.env.SMTP_USER}>`,
                to: 'info.codex2024@gmail.com',
                replyTo: email,
                subject: `New Guest Enquiry: ${subject || 'General Inquiry'}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #0F2C23; border-bottom: 2px solid #C9A05B; padding-bottom: 10px;">New Enquiry Received</h2>
                        <div style="padding: 20px 0;">
                            <p><strong>Guest Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                            <p><strong>Subject:</strong> ${subject || 'General'}</p>
                            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #C9A05B;">
                                <p style="margin: 0;"><strong>Message:</strong></p>
                                <p style="margin-top: 5px;">${message}</p>
                            </div>
                        </div>
                        <p style="font-size: 12px; color: #666; margin-top: 30px;">
                            Sent from NL Josephine's Hotel Website. You can reply directly to this email to reach the guest.
                        </p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email Sending Error:', emailError);
            // We don't fail the request if email fails, as the data is already saved to DB
        }

        return NextResponse.json({ message: 'Enquiry received successfully', id: enquiry.id }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to process enquiry' }, { status: 500 });
    }
}
