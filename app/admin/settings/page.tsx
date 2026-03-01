'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        aboutText: '',
        contactPhone: '',
        contactEmail: '',
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setSettings(data);
                }
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            toast.info('Uploading image...');
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setSettings(prev => ({ ...prev, heroImage: data.url }));
                toast.success('Image uploaded successfully');
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('Upload failed');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                toast.success('Settings saved successfully');
            } else {
                toast.error('Failed to save settings');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-[#0F2C23]">Global Site Settings</h1>
                <p className="text-gray-600 mt-2">Manage your homepage text, images, and contact information.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Hero Title</Label>
                                <Input name="heroTitle" value={settings.heroTitle} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Hero Subtitle</Label>
                                <Input name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Hero Background Image</Label>
                            <div className="flex items-center gap-4">
                                <Input type="file" accept="image/*" onChange={handleImageUpload} className="max-w-sm" />
                                {settings.heroImage && (
                                    <img src={settings.heroImage} alt="Preview" className="h-12 w-24 object-cover rounded shadow" />
                                )}
                            </div>
                            <p className="text-xs text-gray-500">You can also provide a direct URL manually below:</p>
                            <Input name="heroImage" value={settings.heroImage} onChange={handleChange} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About Section</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label>About Text</Label>
                            <Textarea
                                name="aboutText"
                                value={settings.aboutText}
                                onChange={handleChange}
                                className="min-h-[150px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Contact Phone</Label>
                            <Input name="contactPhone" value={settings.contactPhone} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Email</Label>
                            <Input name="contactEmail" type="email" value={settings.contactEmail} onChange={handleChange} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button type="submit" className="bg-[#C9A05B] hover:bg-[#B38F4F] text-[#0F2C23]" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Global Settings'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
