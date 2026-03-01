'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X, ImageIcon, UploadCloud, Users } from 'lucide-react';
import Link from 'next/link';

type TeamMember = {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    image: string | null;
    order: number;
    isActive: boolean;
};

export default function TeamAdmin() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        bio: '',
        image: '',
        order: 0,
        isActive: true
    });

    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/admin/team');
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const formDataPayload = new FormData();
        formDataPayload.append('file', file);
        formDataPayload.append('section', 'team');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataPayload,
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setFormData({ ...formData, image: data.url });
            toast.success('Image uploaded successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', role: '', bio: '', image: '', order: members.length, isActive: true });
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const method = formData.id ? 'PUT' : 'POST';
            const res = await fetch('/api/admin/team', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(`Team member ${formData.id ? 'updated' : 'added'} successfully`);
                fetchTeam();
                resetForm();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to save team member');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while saving.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        try {
            const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Team member deleted');
                fetchTeam();
            } else {
                toast.error('Failed to delete team member');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting member');
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-light tracking-tight">Leadership Team</h1>
                    <p className="text-gray-500">Manage the profiles shown on the About Us page.</p>
                </div>
                {!isEditing && (
                    <Button
                        className="ml-auto bg-[#0F2C23] hover:bg-[#C9A05B]"
                        onClick={() => {
                            resetForm();
                            setIsEditing(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                    </Button>
                )}
            </div>

            {isEditing ? (
                <Card>
                    <CardContent className="p-6 sm:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-medium">{formData.id ? 'Edit' : 'Add'} Team Member</h2>
                            <Button variant="ghost" size="icon" onClick={resetForm}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        required
                                        placeholder="e.g. Josephine H."
                                        value={formData.name || ''}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role / Title</Label>
                                    <Input
                                        required
                                        placeholder="e.g. Founder & Visionary"
                                        value={formData.role || ''}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Biography</Label>
                                <Textarea
                                    placeholder="Enter a short bio..."
                                    className="min-h-[100px]"
                                    value={formData.bio || ''}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Profile Image</Label>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Image URL"
                                                value={formData.image || ''}
                                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            />
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="pl-10 h-10 cursor-pointer"
                                                    onChange={handleImageUpload}
                                                    disabled={uploadingImage}
                                                />
                                                <UploadCloud className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            </div>
                                            {uploadingImage && <p className="text-xs text-brand-gold animate-pulse">Uploading image...</p>}
                                        </div>
                                        {formData.image && (
                                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border bg-gray-50 flex items-center justify-center">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Display Order</Label>
                                        <Input
                                            type="number"
                                            value={formData.order || 0}
                                            onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        />
                                        <p className="text-xs text-gray-500">Lower numbers appear first.</p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="rounded border-gray-300 w-4 h-4 text-[#C9A05B] focus:ring-[#C9A05B]"
                                        />
                                        <Label htmlFor="isActive" className="cursor-pointer">Active / Visible</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6 border-t">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={saving || uploadingImage} className="bg-[#0F2C23] hover:bg-[#C9A05B]">
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Member
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <Card key={i} className="animate-pulse h-[300px]" />
                        ))
                    ) : members.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                            <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                            <p className="text-gray-500 mb-4 max-w-sm mx-auto">Add key leadership and staff profiles to build trust on your About Us page.</p>
                            <Button onClick={() => setIsEditing(true)} className="bg-[#0F2C23] hover:bg-[#C9A05B]">
                                <Plus className="mr-2 h-4 w-4" /> Add Your First Member
                            </Button>
                        </div>
                    ) : (
                        members.map((member) => (
                            <Card key={member.id} className={`overflow-hidden transition-all duration-300 ${!member.isActive ? 'opacity-60 grayscale' : 'hover:shadow-lg'}`}>
                                <div className="aspect-[4/3] relative bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="h-10 w-10 text-gray-300" />
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white backdrop-blur-sm" onClick={() => {
                                            setFormData(member);
                                            setIsEditing(true);
                                        }}>
                                            <Edit2 className="h-4 w-4 text-[#0F2C23]" />
                                        </Button>
                                        <Button size="icon" variant="destructive" className="h-8 w-8 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm" onClick={() => handleDelete(member.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {!member.isActive && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                            Hidden
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-5">
                                    <h3 className="text-lg font-medium text-gray-900 truncate mb-1">{member.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#C9A05B] truncate mb-3">{member.role}</p>
                                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{member.bio || 'No biography provided.'}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
