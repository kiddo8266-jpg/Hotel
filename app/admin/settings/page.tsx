'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Plus, Image as ImageIcon, Video, CheckCircle2, XCircle, GripVertical, Upload, Link as LinkIcon } from 'lucide-react';
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

function SortableHeroItem({ item, handleToggleHero, handleDeleteHero, onUpdateMedia }: { item: HeroItem, handleToggleHero: (item: HeroItem) => void, handleDeleteHero: (id: string) => void, onUpdateMedia: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void }) {
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
                    <div className="h-20 w-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center shrink-0 relative group/hero-img">
                        {item.mediaType === 'image' ? (
                            <img src={item.mediaUrl} className="object-cover w-full h-full" alt="" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <Video size={24} />
                                <span className="text-[10px]">Video</span>
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/hero-img:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                            <Upload size={16} className="text-white" />
                            <span className="text-[8px] text-white font-medium mt-1">Replace</span>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={(e) => onUpdateMedia(e, item.id)}
                            />
                        </label>
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

interface NavItem {
    id: string;
    label: string;
    href: string;
    order: number;
    isHeader: boolean;
    isActive: boolean;
}

function SortableNavItem({ item, handleToggleNav, handleDeleteNav }: { item: NavItem, handleToggleNav: (item: NavItem) => void, handleDeleteNav: (id: string) => void }) {
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
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{item.label}</p>
                            {item.isHeader && <span className="text-[10px] bg-[#C9A05B]/10 text-[#C9A05B] px-2 py-0.5 rounded-full">Header</span>}
                            {!item.isHeader && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Footer</span>}
                        </div>
                        <p className="text-xs text-gray-400 font-mono">{item.href}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="icon" variant="outline" className="h-8 w-8"
                            onClick={(e) => { e.preventDefault(); handleToggleNav(item); }}
                        >
                            {item.isActive ? <CheckCircle2 size={14} className="text-green-600" /> : <XCircle size={14} className="text-red-400" />}
                        </Button>
                        <Button
                            size="icon" variant="outline" className="h-8 w-8 text-red-500"
                            onClick={(e) => { e.preventDefault(); handleDeleteNav(item.id); }}
                        >
                            <Trash2 size={14} />
                        </Button>
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
        footerBadge: '',
        footerDescription: '',
        bookingLink: '',
        logoUrl: '',
        logoAlt: '',
        aboutHeroImage: '',
        aboutVisionImage1: '',
        aboutVisionImage2: '',
        apartmentsHeroImage: '',
        contactHeroImage: '',
        journalHeroImage: '',
    });

    const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [showAddHero, setShowAddHero] = useState(false);
    const [showAddNav, setShowAddNav] = useState(false);
    const [newHero, setNewHero] = useState({
        title: '',
        subtitle: '',
        mediaUrl: '',
        mediaType: 'image',
        order: 0
    });

    const [newNav, setNewNav] = useState({
        label: '',
        href: '',
        isHeader: true,
        order: 0
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [settingsRes, heroRes, navRes] = await Promise.all([
                    fetch('/api/settings'),
                    fetch('/api/admin/hero'),
                    fetch('/api/admin/navigation')
                ]);

                const settingsData = await settingsRes.json();
                const heroData = await heroRes.json();
                const navData = await navRes.json();

                if (settingsData && !settingsData.error) {
                    setSettings(prev => ({ ...prev, ...settingsData }));
                }
                if (Array.isArray(heroData)) {
                    setHeroItems(heroData.sort((a, b) => a.order - b.order));
                }
                if (Array.isArray(navData)) {
                    setNavItems(navData.sort((a: NavItem, b: NavItem) => a.order - b.order));
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

    const handleNavDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setNavItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                fetch('/api/admin/navigation/reorder', {
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

    const handleUpdateHeroMedia = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            toast.info('Uploading replacement...');
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                const heroItem = heroItems.find(h => h.id === id);
                if (!heroItem) return;

                const updateRes = await fetch(`/api/admin/hero/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...heroItem,
                        mediaUrl: data.url,
                        mediaType: file.type.startsWith('video') ? 'video' : 'image'
                    }),
                });

                if (updateRes.ok) {
                    const updated = await updateRes.json();
                    setHeroItems(prev => prev.map(h => h.id === id ? updated : h));
                    toast.success('Hero media updated successfully');
                } else {
                    toast.error('Failed to update hero details');
                }
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('Replacement failed');
        }
    };

    const handleAddNav = async () => {
        if (!newNav.label || !newNav.href) {
            toast.error('Please provide a label and href (URL)');
            return;
        }

        try {
            const res = await fetch('/api/admin/navigation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNav),
            });
            const data = await res.json();
            if (res.ok) {
                setNavItems(prev => [...prev, data]);
                setNewNav({ label: '', href: '', isHeader: true, order: 0 });
                setShowAddNav(false);
                toast.success('Navigation link added');
            }
        } catch {
            toast.error('Failed to add navigation link');
        }
    };

    const handleDeleteNav = async (id: string) => {
        if (!confirm('Delete this navigation link?')) return;
        try {
            const res = await fetch(`/api/admin/navigation/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setNavItems(prev => prev.filter(item => item.id !== id));
                toast.success('Deleted successfully');
            }
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleToggleNav = async (item: NavItem) => {
        try {
            const res = await fetch(`/api/admin/navigation/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, isActive: !item.isActive }),
            });
            if (res.ok) {
                setNavItems(prev => prev.map(n => n.id === item.id ? { ...n, isActive: !n.isActive } : n));
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

            {/* Logo Manager Section */}
            <Card className="border-[#C9A05B]/20">
                <CardHeader className="bg-[#F5F0E6]/50">
                    <CardTitle className="text-[#0F2C23]">Site Logo</CardTitle>
                    <p className="text-sm text-gray-500">Upload your site logo. It appears in the navigation bar and mobile menu. If empty, a text logo is shown instead.</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Label>Logo Image</Label>
                            <label className="group relative block w-full h-32 rounded-2xl overflow-hidden border-2 border-dashed border-[#C9A05B]/30 hover:border-[#C9A05B] cursor-pointer transition-colors bg-gray-50">
                                {settings.logoUrl ? (
                                    <>
                                        <div className="w-full h-full flex items-center justify-center p-4">
                                            <img src={settings.logoUrl} alt={settings.logoAlt || 'Logo preview'} className="max-h-full max-w-full object-contain" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <Upload size={24} className="text-white" />
                                            <span className="text-white text-xs font-medium">Click to change logo</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                        <ImageIcon size={32} strokeWidth={1} className="text-[#C9A05B]/50" />
                                        <span className="text-sm text-gray-400">Click to upload logo</span>
                                        <span className="text-[10px] text-gray-400">PNG with transparency recommended</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                            </label>
                            <Input
                                name="logoUrl"
                                value={settings.logoUrl || ''}
                                onChange={handleChange}
                                placeholder="Or paste a logo URL"
                                className="text-xs text-gray-500"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Logo Alt Text</Label>
                                <Input
                                    name="logoAlt"
                                    value={settings.logoAlt || ''}
                                    onChange={handleChange}
                                    placeholder="NL Josephine's Hotel Logo"
                                />
                                <p className="text-xs text-gray-400">Describes the logo for accessibility and SEO. Shown when the image can&apos;t load.</p>
                            </div>
                            {settings.logoUrl && (
                                <div className="p-4 rounded-xl bg-[#0F2C23] flex items-center justify-center">
                                    <img src={settings.logoUrl} alt={settings.logoAlt || 'Logo'} className="h-10 w-auto object-contain" />
                                </div>
                            )}
                            {!settings.logoUrl && (
                                <div className="p-4 rounded-xl bg-gray-100 text-center">
                                    <p className="text-xs text-gray-500">No logo uploaded — the site will use <strong>&quot;J&quot; circle + hotel name</strong> as the logo.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                                    onUpdateMedia={handleUpdateHeroMedia}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Navigation Manager Section */}
            <div className="space-y-4 pt-6 border-t border-[#0F2C23]/10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-[#0F2C23]">Navigation Links Manager</h2>
                        <p className="text-sm text-gray-500">Manage all website header and footer menu links.</p>
                    </div>
                    <Button
                        onClick={() => setShowAddNav(!showAddNav)}
                        className="bg-[#0F2C23] text-white gap-2"
                    >
                        {showAddNav ? 'Cancel' : <><LinkIcon size={16} /> Add Link</>}
                    </Button>
                </div>

                {showAddNav && (
                    <Card className="border-dashed border-2 border-[#C9A05B]/30">
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Button Label</Label>
                                    <Input
                                        placeholder="e.g. The Sanctuary"
                                        value={newNav.label}
                                        onChange={e => setNewNav(prev => ({ ...prev, label: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL Destination (href)</Label>
                                    <Input
                                        placeholder="e.g. /apartments"
                                        value={newNav.href}
                                        onChange={e => setNewNav(prev => ({ ...prev, href: e.target.value }))}
                                    />
                                    <p className="text-xs text-gray-400">Use relative paths (like /about) for internal pages.</p>
                                </div>
                            </div>
                            <div className="space-y-2 pb-2">
                                <Label>Where should this link appear?</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isHeader"
                                            checked={newNav.isHeader}
                                            onChange={() => setNewNav(prev => ({ ...prev, isHeader: true }))}
                                            className="text-[#C9A05B] focus:ring-[#C9A05B]"
                                        />
                                        Main Header Bar
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isHeader"
                                            checked={!newNav.isHeader}
                                            onChange={() => setNewNav(prev => ({ ...prev, isHeader: false }))}
                                            className="text-[#C9A05B] focus:ring-[#C9A05B]"
                                        />
                                        Footer Column Only
                                    </label>
                                </div>
                            </div>
                            <Button onClick={handleAddNav} className="w-full bg-[#C9A05B] text-[#0F2C23]">Save Navigation Link</Button>
                        </CardContent>
                    </Card>
                )}

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleNavDragEnd}
                >
                    <SortableContext
                        items={navItems}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {navItems.map((item) => (
                                <SortableNavItem
                                    key={item.id}
                                    item={item}
                                    handleToggleNav={handleToggleNav}
                                    handleDeleteNav={handleDeleteNav}
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
                        <p className="text-sm text-gray-500">The &quot;Spirit of NL Josephine&apos;s Hotel&quot; section on the homepage.</p>
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

                {/* Page Hero & Background Images */}
                <Card className="border-[#C9A05B]/20">
                    <CardHeader className="bg-[#F5F0E6]/50">
                        <CardTitle className="text-[#0F2C23]">Page Hero & Background Images</CardTitle>
                        <p className="text-sm text-gray-500">Manage the main high-impact images for different pages of your website.</p>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* About Page Hero */}
                            <div className="space-y-3">
                                <Label className="text-[#0F2C23] font-semibold">About Page: Main Hero</Label>
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-[#C9A05B]/20 relative group">
                                    <img src={settings.aboutHeroImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="About Hero" />
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <div className="flex flex-col items-center text-white">
                                            <Upload size={24} />
                                            <span className="text-xs font-medium mt-2">Change Hero</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'aboutHeroImage')} />
                                    </label>
                                </div>
                                <Input name="aboutHeroImage" value={settings.aboutHeroImage || ''} onChange={handleChange} placeholder="Image URL" className="text-[10px] h-7" />
                            </div>

                            {/* About Vision 1 */}
                            <div className="space-y-3">
                                <Label className="text-[#0F2C23] font-semibold">About Page: Vision Detail 1</Label>
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-[#C9A05B]/20 relative group">
                                    <img src={settings.aboutVisionImage1 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="Vision 1" />
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <div className="flex flex-col items-center text-white">
                                            <Upload size={24} />
                                            <span className="text-xs font-medium mt-2">Change Image</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'aboutVisionImage1')} />
                                    </label>
                                </div>
                                <Input name="aboutVisionImage1" value={settings.aboutVisionImage1 || ''} onChange={handleChange} placeholder="Image URL" className="text-[10px] h-7" />
                            </div>

                            {/* About Vision 2 */}
                            <div className="space-y-3">
                                <Label className="text-[#0F2C23] font-semibold">About Page: Vision Detail 2</Label>
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-[#C9A05B]/20 relative group">
                                    <img src={settings.aboutVisionImage2 || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="Vision 2" />
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <div className="flex flex-col items-center text-white">
                                            <Upload size={24} />
                                            <span className="text-xs font-medium mt-2">Change Image</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'aboutVisionImage2')} />
                                    </label>
                                </div>
                                <Input name="aboutVisionImage2" value={settings.aboutVisionImage2 || ''} onChange={handleChange} placeholder="Image URL" className="text-[10px] h-7" />
                            </div>

                            {/* Apartments Hero */}
                            <div className="space-y-3">
                                <Label className="text-[#0F2C23] font-semibold">Apartments Page Hero</Label>
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-[#C9A05B]/20 relative group">
                                    <img src={settings.apartmentsHeroImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="Apartments Hero" />
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <div className="flex flex-col items-center text-white">
                                            <Upload size={24} />
                                            <span className="text-xs font-medium mt-2">Change Image</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'apartmentsHeroImage')} />
                                    </label>
                                </div>
                                <Input name="apartmentsHeroImage" value={settings.apartmentsHeroImage || ''} onChange={handleChange} placeholder="Image URL" className="text-[10px] h-7" />
                            </div>

                            {/* Contact Hero */}
                            <div className="space-y-3">
                                <Label className="text-[#0F2C23] font-semibold">Contact Page Hero Bg</Label>
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-[#C9A05B]/20 relative group">
                                    <img src={settings.contactHeroImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="Contact Hero" />
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <div className="flex flex-col items-center text-white">
                                            <Upload size={24} />
                                            <span className="text-xs font-medium mt-2">Change Image</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'contactHeroImage')} />
                                    </label>
                                </div>
                                <Input name="contactHeroImage" value={settings.contactHeroImage || ''} onChange={handleChange} placeholder="Image URL" className="text-[10px] h-7" />
                            </div>

                            {/* Journal Hero */}
                            <div className="space-y-3">
                                <Label className="text-[#0F2C23] font-semibold">Journal Page Hero Bg</Label>
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-[#C9A05B]/20 relative group">
                                    <img src={settings.journalHeroImage || 'https://images.unsplash.com/photo-1455391704245-2376bb74b358?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="Journal Hero" />
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <div className="flex flex-col items-center text-white">
                                            <Upload size={24} />
                                            <span className="text-xs font-medium mt-2">Change Image</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'journalHeroImage')} />
                                    </label>
                                </div>
                                <Input name="journalHeroImage" value={settings.journalHeroImage || ''} onChange={handleChange} placeholder="Image URL" className="text-[10px] h-7" />
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
                            <div className="space-y-2 mt-4">
                                <h3 className="font-semibold text-lg text-[#0F2C23] border-b pb-2 mt-6">Footer Configuration</h3>

                                <div className="grid gap-4 mt-4">
                                    <div className="space-y-2">
                                        <Label>Footer Branding Badge (Uppercase style)</Label>
                                        <Input
                                            name="footerBadge"
                                            value={settings.footerBadge || ''}
                                            onChange={handleChange}
                                            placeholder="e.g. A Sanctuary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Footer Branding Description</Label>
                                        <Textarea
                                            name="footerDescription"
                                            value={settings.footerDescription || ''}
                                            onChange={handleChange}
                                            className="min-h-[80px]"
                                            placeholder="Experience quiet luxury and uncompromising comfort..."
                                        />
                                    </div>
                                </div>
                            </div>
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
                            <div className="space-y-2 mt-4 col-span-2">
                                <Label>Global Booking / Payment Gateway Link</Label>
                                <Input name="bookingLink" value={settings.bookingLink || ''} onChange={handleChange} placeholder="https://..." />
                                <p className="text-xs text-gray-400">If provided, guests will be redirected here after submitting a viewing/booking request.</p>
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
