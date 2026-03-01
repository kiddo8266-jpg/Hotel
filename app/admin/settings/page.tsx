'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Plus, Image as ImageIcon, Video, CheckCircle2, XCircle } from 'lucide-react';

interface HeroItem {
    id: string;
    title: string | null;
    subtitle: string | null;
    mediaUrl: string;
    mediaType: string;
    order: number;
    isActive: boolean;
}

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
        aboutHero: '',
        aboutVision: '',
        aboutStory: '',
    });

    const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
    const [showAddHero, setShowAddHero] = useState(false);
    const [newHero, setNewHero] = useState({
        title: '',
        subtitle: '',
        mediaUrl: '',
        mediaType: 'image',
        order: 0
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [settingsRes, heroRes] = await Promise.all([
                    fetch('/api/settings'),
                    fetch('/api/admin/hero')
                ]);

                const settingsData = await settingsRes.json();
                const heroData = await heroRes.json();

                if (settingsData && !settingsData.error) setSettings(settingsData);
                if (Array.isArray(heroData)) setHeroItems(heroData);
            } catch (error) {
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHeroItem: boolean = false) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            toast.info('Uploading...');
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                if (isHeroItem) {
                    setNewHero(prev => ({ ...prev, mediaUrl: data.url, mediaType: file.type.startsWith('video') ? 'video' : 'image' }));
                } else {
                    setSettings(prev => ({ ...prev, heroImage: data.url }));
                }
                toast.success('File uploaded successfully');
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('Upload failed');
        }
    };

    const handleAddHero = async () => {
        if (!newHero.mediaUrl) {
            toast.error('Please upload or provide a media URL');
            return;
        }

        try {
            const res = await fetch('/api/admin/hero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHero),
            });
            const data = await res.json();
            if (res.ok) {
                setHeroItems(prev => [...prev, data]);
                setNewHero({ title: '', subtitle: '', mediaUrl: '', mediaType: 'image', order: 0 });
                setShowAddHero(false);
                toast.success('Hero item added');
            }
        } catch {
            toast.error('Failed to add hero item');
        }
    };

    const handleDeleteHero = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hero item?')) return;
        try {
            const res = await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setHeroItems(prev => prev.filter(item => item.id !== id));
                toast.success('Deleted successfully');
            }
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleToggleHero = async (item: HeroItem) => {
        try {
            const res = await fetch(`/api/admin/hero/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, isActive: !item.isActive }),
            });
            if (res.ok) {
                setHeroItems(prev => prev.map(h => h.id === item.id ? { ...h, isActive: !h.isActive } : h));
            }
        } catch {
            toast.error('Toggle failed');
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
                toast.success('Site settings saved successfully');
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
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-[#0F2C23]">Global Site Settings</h1>
                <p className="text-gray-600 mt-2">Manage your homepage text, Hero media (Images/Videos), and contact info.</p>
            </div>

            {/* Hero Manager Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Hero Content Manager</h2>
                    <Button
                        onClick={() => setShowAddHero(!showAddHero)}
                        className="bg-[#0F2C23] text-white gap-2"
                    >
                        {showAddHero ? 'Cancel' : <><Plus size={16} /> Add Hero Item</>}
                    </Button>
                </div>

                {showAddHero && (
                    <Card className="border-dashed border-2">
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Title (Optional)</Label>
                                    <Input
                                        placeholder="Welcome to NL Josephine's Hotel"
                                        value={newHero.title}
                                        onChange={e => setNewHero(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle (Optional)</Label>
                                    <Input
                                        placeholder="Experience Quiet Luxury"
                                        value={newHero.subtitle}
                                        onChange={e => setNewHero(prev => ({ ...prev, subtitle: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Upload Media (Image or Video)</Label>
                                <div className="flex items-center gap-4">
                                    <Input type="file" accept="image/*,video/*" onChange={e => handleFileUpload(e, true)} />
                                    {newHero.mediaUrl && (
                                        <div className="text-sm text-green-600 flex items-center gap-1">
                                            <CheckCircle2 size={16} /> Ready
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button onClick={handleAddHero} color="primary" className="w-full">Save Hero Item</Button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {heroItems.map((item) => (
                        <Card key={item.id} className={!item.isActive ? 'opacity-50' : ''}>
                            <CardContent className="p-4 flex gap-4">
                                <div className="h-20 w-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center shrink-0">
                                    {item.mediaType === 'image' ? (
                                        <img src={item.mediaUrl} className="object-cover w-full h-full" alt="" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <Video size={24} />
                                            <span className="text-[10px]">Video</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="font-semibold text-sm truncate">{item.title || 'No Title'}</p>
                                    <p className="text-xs text-gray-400 truncate">{item.mediaUrl}</p>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="icon" variant="outline" className="h-8 w-8"
                                            onClick={() => handleToggleHero(item)}
                                        >
                                            {item.isActive ? <CheckCircle2 size={14} className="text-green-600" /> : <XCircle size={14} className="text-red-400" />}
                                        </Button>
                                        <Button
                                            size="icon" variant="outline" className="h-8 w-8 text-red-500"
                                            onClick={() => handleDeleteHero(item.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Global Site Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-[#0F2C23] border-b pb-2">About Us Page Content</h3>
                            <div className="space-y-2">
                                <Label>Hero Headline</Label>
                                <Input
                                    name="aboutHero"
                                    value={settings.aboutHero || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. More Than a Residence.\nA Sanctuary."
                                />
                                <p className="text-xs text-gray-400">Use \n for line breaks</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Vision Headline</Label>
                                <Input
                                    name="aboutVision"
                                    value={settings.aboutVision || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. Born from a desire to blend uncompromising tranquility..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vision Story</Label>
                                <Textarea
                                    name="aboutStory"
                                    value={settings.aboutStory || ''}
                                    onChange={handleChange}
                                    className="min-h-[150px]"
                                    placeholder="Enter the main body text for the About Us story section."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-[#0F2C23] border-b pb-2 mt-6">Homepage / General</h3>
                            <Label>Short About Text (Homepage)</Label>
                            <Textarea
                                name="aboutText"
                                value={settings.aboutText}
                                onChange={handleChange}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Contact Phone</Label>
                                <Input name="contactPhone" value={settings.contactPhone} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Email</Label>
                                <Input name="contactEmail" type="email" value={settings.contactEmail} onChange={handleChange} />
                            </div>
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

