'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, ShieldCheck, Wifi, Car, Leaf, Wine, Zap, Tv, Sparkles, Home, Bath, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

type Amenity = {
    id: string;
    iconName: string;
    title: string;
    description: string;
    image?: string;
    isActive: boolean;
    order: number;
};

// Map string names to actual Lucide icons for preview
const iconMap: Record<string, any> = {
    Wifi, ShieldCheck, Car, Leaf, Wine, Zap, Tv, Sparkles, Home, Bath
};

export default function AdminAmenities() {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Amenity>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/amenities');
            const data = await res.json();
            setAmenities(data);
        } catch (error) {
            console.error('Failed to fetch amenities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        setUploading(true);
        try {
            toast.info('Uploading image...');
            const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, image: data.url }));
                toast.success('Image uploaded!');
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (id?: string) => {
        const url = id ? `/api/amenities/${id}` : '/api/amenities';
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(id ? 'Amenity updated!' : 'Amenity created!');
                fetchAmenities();
                setIsEditing(null);
                setIsCreating(false);
                setFormData({});
            }
        } catch (error) {
            console.error('Failed to save amenity:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this amenity?')) return;

        try {
            const res = await fetch(`/api/amenities/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Amenity deleted');
                fetchAmenities();
            }
        } catch (error) {
            console.error('Failed to delete amenity:', error);
        }
    };

    const startEdit = (amenity: Amenity) => {
        setIsEditing(amenity.id);
        setFormData(amenity);
        setIsCreating(false);
    };

    // Reusable image upload cell
    const ImageUploadCell = () => (
        <td className="p-3">
            <div className="flex flex-col items-center gap-2">
                {formData.image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A05B]/30 shrink-0">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-400" />
                    </div>
                )}
                <label className={`flex items-center gap-1 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-[#F5F0E6] text-[#0F2C23] hover:bg-[#C9A05B]/20'}`}>
                    <Upload size={10} />
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
            </div>
        </td>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-serif text-[#0F2C23]">Hotel Amenities</h1>
                    <p className="text-gray-500 mt-1">Manage the amenities displayed on the home page. Upload a round image for each amenity.</p>
                </div>
                <button
                    onClick={() => { setIsCreating(true); setIsEditing(null); setFormData({ iconName: 'Wifi', isActive: true, order: 0, image: '' }); }}
                    className="flex items-center gap-2 bg-[#0F2C23] text-white px-5 py-2.5 rounded hover:bg-[#C9A05B] transition-colors shadow-sm"
                >
                    <Plus size={18} /> Add Amenity
                </button>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-medium text-gray-500 text-sm w-20 text-center">Image</th>
                                <th className="p-4 font-medium text-gray-500 text-sm w-16 text-center">Icon</th>
                                <th className="p-4 font-medium text-gray-500 text-sm">Title</th>
                                <th className="p-4 font-medium text-gray-500 text-sm">Description</th>
                                <th className="p-4 font-medium text-gray-500 text-sm w-20">Order</th>
                                <th className="p-4 font-medium text-gray-500 text-sm w-24">Status</th>
                                <th className="p-4 font-medium text-gray-500 text-sm w-28 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isCreating && (
                                <tr className="bg-blue-50/30">
                                    <ImageUploadCell />
                                    <td className="p-3">
                                        <select
                                            value={formData.iconName || ''}
                                            onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded focus:border-[#C9A05B] focus:ring-1 focus:ring-[#C9A05B] outline-none"
                                        >
                                            {Object.keys(iconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            placeholder="e.g. Free Fast WiFi"
                                            value={formData.title || ''}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded focus:border-[#C9A05B] focus:ring-1 focus:ring-[#C9A05B] outline-none"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            placeholder="Short description..."
                                            value={formData.description || ''}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded focus:border-[#C9A05B] focus:ring-1 focus:ring-[#C9A05B] outline-none"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            value={formData.order || 0}
                                            onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded focus:border-[#C9A05B] focus:ring-1 focus:ring-[#C9A05B] outline-none"
                                        />
                                    </td>
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive || false}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-4 h-4 text-[#C9A05B] focus:ring-[#C9A05B] rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleSave()} className="p-2 text-green-600 hover:bg-green-50 rounded transition"><Check size={16} /></button>
                                            <button onClick={() => setIsCreating(false)} className="p-2 text-red-500 hover:bg-red-50 rounded transition"><X size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {isLoading && !isCreating ? (
                                <tr><td colSpan={7} className="p-8 text-center">
                                    <div className="flex justify-center gap-3 animate-pulse">
                                        {[1, 2, 3].map(i => <div key={i} className="w-12 h-12 rounded-full bg-gray-200" />)}
                                    </div>
                                </td></tr>
                            ) : amenities.length === 0 && !isCreating ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No amenities found. Add one to get started.</td></tr>
                            ) : (
                                amenities.map(amenity => (
                                    <tr key={amenity.id} className="hover:bg-gray-50/50 transition-colors">
                                        {isEditing === amenity.id ? (
                                            <>
                                                <ImageUploadCell />
                                                <td className="p-3">
                                                    <select
                                                        value={formData.iconName || ''}
                                                        onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                                                        className="w-full p-2 text-sm border border-gray-200 rounded"
                                                    >
                                                        {Object.keys(iconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                                    </select>
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        value={formData.title || ''}
                                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                        className="w-full p-2 text-sm border border-gray-200 rounded"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        value={formData.description || ''}
                                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                        className="w-full p-2 text-sm border border-gray-200 rounded"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        value={formData.order || 0}
                                                        onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                                        className="w-full p-2 text-sm border border-gray-200 rounded"
                                                    />
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isActive || false}
                                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleSave(amenity.id)} className="p-2 text-green-600 hover:bg-green-50 rounded"><Check size={16} /></button>
                                                        <button onClick={() => setIsEditing(null)} className="p-2 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A05B]/20 mx-auto shrink-0 bg-[#F5F0E6] flex items-center justify-center">
                                                        {amenity.image ? (
                                                            <img src={amenity.image} alt={amenity.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            (() => { const Icon = iconMap[amenity.iconName] || Home; return <Icon size={20} className="text-[#0F2C23]" />; })()
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="w-10 h-10 rounded-lg bg-[#F5F0E6] flex items-center justify-center mx-auto text-[#0F2C23]">
                                                        {iconMap[amenity.iconName] ? (
                                                            (() => { const Icon = iconMap[amenity.iconName]; return <Icon size={18} />; })()
                                                        ) : (
                                                            <Home size={18} />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-medium text-gray-900">{amenity.title}</td>
                                                <td className="p-4 text-sm text-gray-500">{amenity.description}</td>
                                                <td className="p-4 text-sm text-gray-500">{amenity.order}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${amenity.isActive ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'}`}>
                                                        {amenity.isActive ? 'Active' : 'Hidden'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => startEdit(amenity)}
                                                            className="p-2 text-gray-400 hover:text-[#C9A05B] hover:bg-[#F5F0E6] rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(amenity.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
