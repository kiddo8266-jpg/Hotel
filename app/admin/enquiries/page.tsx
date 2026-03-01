'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Calendar, User, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);

    const loadEnquiries = async () => {
        try {
            const res = await fetch('/api/admin/enquiries');
            const data = await res.json();
            if (Array.isArray(data)) setEnquiries(data);
        } catch (error) {
            toast.error('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEnquiries();
    }, []);

    const toggleRead = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/enquiries', {
                method: 'PATCH',
                body: JSON.stringify({ id, isRead: !currentStatus })
            });
            if (res.ok) {
                setEnquiries(prev => prev.map(e => e.id === id ? { ...e, isRead: !currentStatus } : e));
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteEnquiry = async (id: string) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setEnquiries(prev => prev.filter(e => e.id !== id));
                toast.success('Enquiry deleted');
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#C9A05B]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-light text-[#0F2C23]">Guest Enquiries</h1>
                <p className="text-gray-500 mt-2">Manage incoming messages from the contact form</p>
            </div>

            <div className="grid gap-6">
                {enquiries.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Mail size={48} className="mb-4 opacity-20" />
                            <p>No enquiries found yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    enquiries.map((enquiry) => (
                        <Card key={enquiry.id} className={`overflow-hidden border-l-4 ${enquiry.isRead ? 'border-l-gray-200' : 'border-l-[#C9A05B]'}`}>
                            <CardHeader className="bg-gray-50/50">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${enquiry.isRead ? 'bg-gray-100 text-gray-400' : 'bg-[#C9A05B]/10 text-[#C9A05B]'}`}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-medium">{enquiry.name}</CardTitle>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Mail size={14} /> {enquiry.email}</span>
                                                {enquiry.phone && <span>· {enquiry.phone}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(enquiry.createdAt).toLocaleString()}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-[#C9A05B] hover:text-[#0F2C23] hover:bg-[#C9A05B]/10"
                                            onClick={() => window.location.href = `mailto:${enquiry.email}?subject=RE: ${enquiry.subject || 'Enquiry at NL Josephine Hotel'}&body=Dear ${enquiry.name},%0D%0A%0D%0AThank you for contacting NL Josephine's Hotel.%0D%0A%0D%0AIn response to your enquiry regarding: "${enquiry.message.substring(0, 100)}${enquiry.message.length > 100 ? '...' : ''}"%0D%0A%0D%0A`}
                                            title="Reply to guest"
                                        >
                                            <Mail size={18} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleRead(enquiry.id, enquiry.isRead)}
                                            title={enquiry.isRead ? 'Mark as unread' : 'Mark as read'}
                                        >
                                            {enquiry.isRead ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => deleteEnquiry(enquiry.id)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-6">
                                {enquiry.subject && (
                                    <h4 className="font-semibold text-[#0F2C23] mb-2">Subject: {enquiry.subject}</h4>
                                )}
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
