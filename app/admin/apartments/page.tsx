// app/admin/apartments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Apartment = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  features: string; // comma-separated for simplicity
};

export default function AdminApartments() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Apartment | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    features: '',
  });

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const res = await fetch('/api/admin/apartments');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setApartments(data);
    } catch (err) {
      toast.error('Could not load apartments');
    } finally {
      setLoading(false);
    }
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
        setForm(prev => ({ ...prev, image: data.url }));
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
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/apartments/${editing.id}` : '/api/admin/apartments';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          size: Number(form.size),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Operation failed');
      }

      toast.success(editing ? 'Apartment updated' : 'Apartment created');
      setOpen(false);
      resetForm();
      fetchApartments();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this apartment?')) return;
    try {
      const res = await fetch(`/api/admin/apartments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Apartment deleted');
      fetchApartments();
    } catch (err) {
      toast.error('Could not delete');
    }
  };

  const startEdit = (apt: Apartment) => {
    setEditing(apt);
    setForm({
      title: apt.title,
      description: apt.description,
      price: apt.price.toString(),
      image: apt.image,
      type: apt.type,
      bedrooms: apt.bedrooms.toString(),
      bathrooms: apt.bathrooms.toString(),
      size: apt.size.toString(),
      features: apt.features,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      image: '',
      type: '',
      bedrooms: '',
      bathrooms: '',
      size: '',
      features: '',
    });
    setEditing(null);
  };

  return (
    <div className="p-8 bg-[#0F2C23] text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-light">Manage Apartments</h1>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gold-btn">
                <Plus className="mr-2 h-4 w-4" /> Add Apartment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-[#1a3a33] text-white border-[#C9A05B]/30">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editing ? 'Edit Apartment' : 'New Apartment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">Title *</label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Type (e.g. 2-Bedroom Deluxe)</label>
                    <Input
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Price (UGX) *</label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                      className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Bedrooms</label>
                      <Input
                        type="number"
                        value={form.bedrooms}
                        onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                        className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Bathrooms</label>
                      <Input
                        type="number"
                        value={form.bathrooms}
                        onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                        className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Size (sqm)</label>
                      <Input
                        type="number"
                        value={form.size}
                        onChange={(e) => setForm({ ...form, size: e.target.value })}
                        className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Features (comma separated)</label>
                  <Input
                    value={form.features}
                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                    placeholder="e.g. Balcony, WiFi, Parking, Fully furnished"
                    className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Apartment Image</label>
                  <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-[#0F2C23]/70 border-[#C9A05B]/30 max-w-sm" />
                    {form.image && (
                      <img src={form.image} alt="Preview" className="h-10 w-16 object-cover rounded shadow" />
                    )}
                  </div>
                  <Input
                    className="mt-2 bg-[#0F2C23]/70 border-[#C9A05B]/30 text-xs text-gray-400"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Or enter URL manually"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gold-btn">
                    {editing ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading apartments...</div>
        ) : apartments.length === 0 ? (
          <div className="text-center py-20 opacity-70">No apartments yet. Add one above.</div>
        ) : (
          <div className="rounded-md border border-[#C9A05B]/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#1a3a33]">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price (UGX)</TableHead>
                  <TableHead>Beds / Baths</TableHead>
                  <TableHead>Size (sqm)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apartments.map((apt) => (
                  <TableRow key={apt.id} className="hover:bg-[#1a3a33]/50">
                    <TableCell className="font-medium">{apt.title}</TableCell>
                    <TableCell>{apt.type}</TableCell>
                    <TableCell>{apt.price.toLocaleString()}</TableCell>
                    <TableCell>{apt.bedrooms} / {apt.bathrooms}</TableCell>
                    <TableCell>{apt.size}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(apt)}
                        className="text-[#C9A05B] hover:text-[#C9A05B]/80 hover:bg-[#C9A05B]/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(apt.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}