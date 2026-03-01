// app/admin/gallery/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Film } from 'lucide-react';

type MediaItem = {
  id: string;
  url: string;
  type: string;
  alt: string;
  section: string;
  area: string;
  createdAt: string;
};

const SECTIONS = ['gallery', 'apartments', 'about', 'hero'];

const AREAS = [
  'Living Area',
  'Bedroom',
  'Shower',
  'Dining',
  'Balcony',
  'Kitchen',
  'Compound',
  'Parking',
  'Restaurant',
  'Office',
  'Washing Bay',
  'Swimming Pool',
  'Lobby',
  'Conference Room',
  'Garden',
  'Other',
];

export default function AdminGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    url: '',
    type: 'image',
    alt: '',
    section: 'gallery',
    area: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error('Could not load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const isVideo = file.type.startsWith('video/');
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploading(true);
      toast.info('Uploading file...');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => ({ ...prev, url: data.url, type: isVideo ? 'video' : 'image' }));
        toast.success('File uploaded successfully');
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/gallery/${editing.id}` : '/api/admin/gallery';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Operation failed');
      }
      toast.success(editing ? 'Item updated' : 'Item added');
      setOpen(false);
      resetForm();
      fetchItems();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Item deleted');
      fetchItems();
    } catch {
      toast.error('Could not delete item');
    }
  };

  const startEdit = (item: MediaItem) => {
    setEditing(item);
    setForm({ url: item.url, type: item.type, alt: item.alt, section: item.section, area: item.area || '' });
    setOpen(true);
  };

  const resetForm = () => {
    setForm({ url: '', type: 'image', alt: '', section: 'gallery', area: '' });
    setEditing(null);
  };

  return (
    <div className="p-8 bg-[#0F2C23] text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-light">Manage Gallery</h1>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gold-btn">
                <Plus className="mr-2 h-4 w-4" /> Add Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl bg-[#1a3a33] text-white border-[#C9A05B]/30">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editing ? 'Edit Media Item' : 'New Media Item'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm mb-2">Upload File (image or video)</label>
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                  />
                  <Input
                    className="mt-2 bg-[#0F2C23]/70 border-[#C9A05B]/30 text-xs text-gray-400"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="Or enter URL manually"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#0F2C23]/70 border border-[#C9A05B]/30 text-white text-sm"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Section</label>
                    <select
                      value={form.section}
                      onChange={(e) => setForm({ ...form, section: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#0F2C23]/70 border border-[#C9A05B]/30 text-white text-sm"
                    >
                      {SECTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Alt Text / Description</label>
                  <Input
                    value={form.alt}
                    onChange={(e) => setForm({ ...form, alt: e.target.value })}
                    className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                    placeholder="Describe the media..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Hotel Area</label>
                  <select
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0F2C23]/70 border border-[#C9A05B]/30 text-white text-sm"
                  >
                    <option value="">— Select Area —</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gold-btn" disabled={uploading}>
                    {editing ? 'Update' : 'Add'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading gallery...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 opacity-70">No media items yet. Add one above.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg overflow-hidden border border-[#C9A05B]/20 bg-[#1a3a33]"
              >
                {item.type === 'video' ? (
                  <div className="w-full h-40 flex items-center justify-center bg-[#0F2C23]/60">
                    <Film className="w-10 h-10 text-[#C9A05B]/60" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-3">
                  <p className="text-xs text-gray-300 truncate">{item.alt || '—'}</p>
                  <p className="text-xs text-[#C9A05B] capitalize mt-0.5">{item.section} · {item.type}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(item)}
                    className="h-7 w-7 p-0 bg-black/60 text-[#C9A05B] hover:bg-black/80"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-7 w-7 p-0 bg-black/60 text-red-400 hover:bg-black/80"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
