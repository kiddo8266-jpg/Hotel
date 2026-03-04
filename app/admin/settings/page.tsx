'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Plus, Image as ImageIcon, Video, CheckCircle2, XCircle, GripVertical, Upload } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface HeroItem {
    id: string;
    title: string | null;
    subtitle: string | null;
    mediaUrl: string;
    mediaType: string;
    order: number;
    isActive: boolean;
}

function SortableHeroItem({ item, handleToggleHero, handleDeleteHero }: { item: HeroItem, handleToggleHero: any, handleDeleteHero: any }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="w-full">
            <Card className={!item.isActive ? 'opacity-50' : ''}>
                <CardContent className="p-4 flex gap-4 items-center">
                    <div {...attributes} {...listeners} className="cursor-grab hover:text-[#C9A05B]">
                        <GripVertical size={20} />
                    </div>
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
                                onClick={(e) => { e.preventDefault(); handleToggleHero(item); }}
                            >
                                {item.isActive ? <CheckCircle2 size={14} className="text-green-600" /> : <XCircle size={14} className="text-red-400" />}
                            </Button>
                            <Button
                                size="icon" variant="outline" className="h-8 w-8 text-red-500"
                                onClick={(e) => { e.preventDefault(); handleDeleteHero(item.id); }}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        hotelName: '',
        address: '',
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        aboutText: '',
        contactPhone: '',
        contactEmail: '',
        aboutHero: '',
        aboutVision: '',
        aboutStory: '',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        youtubeUrl: '',
        tiktokUrl: '',
        seoKeywords: '',
        seoDescription: '',
        spiritImage: '',
        spiritHeading: '',
        spiritLabel: '',
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

                if (settingsData && !settingsData.error) {
                    setSettings(prev => ({ ...prev, ...settingsData }));
                }
                if (Array.isArray(heroData)) {
                    setHeroItems(heroData.sort((a, b) => a.order - b.order));
                }
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

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setHeroItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order in database
                fetch('/api/admin/hero/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: newItems.map((item, index) => ({ id: item.id, order: index }))
                    }),
                });

                return newItems;
            });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
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
                if (fieldName === 'newHero') {
                    setNewHero(prev => ({ ...prev, mediaUrl: data.url, mediaType: file.type.startsWith('video') ? 'video' : 'image' }));
                } else {
                    setSettings(prev => ({ ...prev, [fieldName]: data.url }));
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

    if (loading) return (
        <div className="flex flex-col gap-6 animate-pulse max-w-5xl mx-auto p-8">
            <div className="h-10 w-64 bg-gray-200 rounded-lg" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-gray-100 border border-gray-200" />
            ))}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-8 pb-20">
            <div>
                <h1 className="text-3xl font-serif text-[#0F2C23]">Global Site Settings</h1>
                <p className="text-gray-600 mt-2">Manage your homepage text, Hero media (Images/Videos), and all website content.</p>
            </div>

            {/* Hero Manager Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[#0F2C23]">Multi-Hero Slider Manager</h2>
                    <Button
                        onClick={() => setShowAddHero(!showAddHero)}
                        className="bg-[#0F2C23] text-white gap-2"
                    >
                        {showAddHero ? 'Cancel' : <><Plus size={16} /> Add Hero Item</>}
                    </Button>
                </div>

                {showAddHero && (
                    <Card className="border-dashed border-2 border-[#C9A05B]/30">
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
                                    <Input type="file" accept="image/*,video/*" onChange={e => handleFileUpload(e, 'newHero')} />
                                    {newHero.mediaUrl && (
                                        <div className="text-sm text-green-600 flex items-center gap-1">
                                            <CheckCircle2 size={16} /> Ready
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button onClick={handleAddHero} className="w-full bg-[#C9A05B] text-[#0F2C23]">Save Hero Item</Button>
                        </CardContent>
                    </Card>
                )}

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={heroItems}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {heroItems.map((item) => (
                                <SortableHeroItem
                                    key={item.id}
                                    item={item}
                                    handleToggleHero={handleToggleHero}
                                    handleDeleteHero={handleDeleteHero}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Spirit Section Configuration */}
                <Card className="border-[#C9A05B]/20">
                    <CardHeader className="bg-[#F5F0E6]/50">
                        <CardTitle className="text-[#0F2C23]">Spirit Section Configuration</CardTitle>
                        <p className="text-sm text-gray-500">The "Spirit of NL Josephine's Hotel" section on the homepage.</p>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Section Label</Label>
                                    <Input
                                        name="spiritLabel"
                                        value={settings.spiritLabel || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. Our Heritage"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Section Heading</Label>
                                    <Textarea
                                        name="spiritHeading"
                                        value={settings.spiritHeading || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. The Spirit of NL Josephine's Hotel"
                                    />
                                    <p className="text-xs text-gray-400">Use \n for line break (the part after \n will be italicized gold)</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Section Image</Label>
                                <div className="space-y-4">
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-[#C9A05B]/20 relative group">
                                        {settings.spiritImage ? (
                                            <img src={settings.spiritImage} className="w-full h-full object-cover" alt="Spirit section" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                <ImageIcon size={48} strokeWidth={1} />
                                                <span className="text-sm mt-2">No Image Set</span>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <div className="flex flex-col items-center text-white">
                                                <Upload size={32} />
                                                <span className="text-sm font-medium mt-2">Change Image</span>
                                            </div>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'spiritImage')} />
                                        </label>
                                    </div>
                                    <Input
                                        name="spiritImage"
                                        value={settings.spiritImage || ''}
                                        onChange={handleChange}
                                        placeholder="Image URL"
                                        className="text-xs text-gray-500 border-none bg-transparent h-auto p-0 focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                            <Label>Spirit Section Description (under heading)</Label>
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
                            <div className="space-y-2 mt-4">
                                <Label>Hotel Name</Label>
                                <Input name="hotelName" value={settings.hotelName || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-2 mt-4">
                                <Label>Physical Address</Label>
                                <Textarea name="address" value={settings.address || ''} onChange={handleChange} placeholder="Seguku, Entebbe Road\nKampala, Uganda" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 mt-6">
                            <h3 className="font-semibold text-lg text-[#0F2C23]">Social Media Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Facebook URL</Label>
                                    <Input name="facebookUrl" type="url" value={settings.facebookUrl || ''} onChange={handleChange} placeholder="https://facebook.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Instagram URL</Label>
                                    <Input name="instagramUrl" type="url" value={settings.instagramUrl || ''} onChange={handleChange} placeholder="https://instagram.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Twitter/X URL</Label>
                                    <Input name="twitterUrl" type="url" value={settings.twitterUrl || ''} onChange={handleChange} placeholder="https://twitter.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>YouTube URL</Label>
                                    <Input name="youtubeUrl" type="url" value={settings.youtubeUrl || ''} onChange={handleChange} placeholder="https://youtube.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>TikTok URL</Label>
                                    <Input name="tiktokUrl" type="url" value={settings.tiktokUrl || ''} onChange={handleChange} placeholder="https://tiktok.com/..." />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 mt-6">
                            <h3 className="font-semibold text-lg text-[#0F2C23]">Search Engine Optimization (SEO)</h3>
                            <div className="space-y-2">
                                <Label>SEO Keywords</Label>
                                <Input name="seoKeywords" value={settings.seoKeywords || ''} onChange={handleChange} placeholder="e.g. hotel, luxury, entebbe, accommodation" />
                                <p className="text-xs text-gray-400">Comma-separated list of keywords that help guests find your hotel.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>SEO Site Description</Label>
                                <Textarea name="seoDescription" value={settings.seoDescription || ''} onChange={handleChange} placeholder="A short description of the hotel for search engines..." />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 -mx-6 mb-[-1.5rem] mt-10 flex justify-end z-10">
                    <Button type="submit" className="bg-[#C9A05B] hover:bg-[#B38F4F] text-[#0F2C23] px-8 py-4 h-auto text-lg font-medium shadow-lg" disabled={saving}>
                        {saving ? 'Saving...' : 'Save All Global Settings'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
