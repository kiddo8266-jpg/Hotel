// app/admin/gallery/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { Plus, Edit, Trash2, Film, LayoutGrid, List } from 'lucide-react';

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

const PAGE_SIZE = 12;

const SELECT_CLS =
  'bg-[#1a3a33] border border-[#C9A05B]/30 text-white text-sm px-3 py-2 rounded';

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

  // Filters & view
  const [search, setSearch] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirmation dialog
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [search, filterSection, filterArea, sortBy]);

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
    if (!form.url) {
      toast.error('Please upload a file or enter a URL first');
      return;
    }
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
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget === 'bulk') {
        await Promise.all(
          Array.from(selectedIds).map((id) =>
            fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
          )
        );
        toast.success(`${selectedIds.size} items deleted`);
        setSelectedIds(new Set());
      } else {
        const res = await fetch(`/api/admin/gallery/${deleteTarget}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        toast.success('Item deleted');
      }
      fetchItems();
    } catch {
      toast.error('Could not delete item(s)');
    } finally {
      setDeleteTarget(null);
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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Filtered + sorted items
  const filtered = useMemo(() => {
    let result = items.filter((item) => {
      const matchSearch = !search || (item.alt ?? '').toLowerCase().includes(search.toLowerCase());
      const matchSection = !filterSection || item.section === filterSection;
      const matchArea = !filterArea || item.area === filterArea;
      return matchSearch && matchSection && matchArea;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'section') return a.section.localeCompare(b.section);
      if (sortBy === 'area') return (a.area || '').localeCompare(b.area || '');
      // newest (default)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [items, search, filterSection, filterArea, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const allPageSelected =
    paginated.length > 0 && paginated.every((item) => selectedIds.has(item.id));

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((item) => next.add(item.id));
        return next;
      });
    }
  };

  const imageCount = items.filter((i) => i.type === 'image').length;
  const videoCount = items.filter((i) => i.type === 'video').length;

  return (
    <div className="p-8 bg-[#0F2C23] text-white min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-light">Manage Gallery</h1>
            {!loading && (
              <p className="text-sm text-white/60 mt-1">
                {items.length} total · {imageCount} images · {videoCount} videos
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex gap-1 border border-[#C9A05B]/30 rounded p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#C9A05B]/20 text-[#C9A05B]'
                    : 'text-white/50 hover:text-white'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#C9A05B]/20 text-[#C9A05B]'
                    : 'text-white/50 hover:text-white'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Add Media dialog */}
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
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by description..."
            className="bg-[#1a3a33] border-[#C9A05B]/30 text-white w-56"
          />
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="">All Sections</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="">All Areas</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="section">By Section</option>
            <option value="area">By Area</option>
          </select>
        </div>

        {/* Confirmation dialog */}
        <Dialog open={deleteTarget !== null} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
          <DialogContent className="max-w-sm bg-[#1a3a33] text-white border-[#C9A05B]/30">
            <DialogHeader>
              <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-white/70 mt-2">Are you sure?</p>
            <p className="text-xs text-white/50">This action cannot be undone.</p>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {loading ? (
          <div className="text-center py-20">Loading gallery...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 opacity-70">
            {items.length === 0 ? 'No media items yet. Add one above.' : 'No items match your filters.'}
          </div>
        ) : (
          <>
            {/* Bulk action bar */}
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleSelectAll}
                  className="accent-[#C9A05B] h-4 w-4"
                />
                Select All
              </label>
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 bg-[#1a3a33] border border-red-500/30 rounded px-4 py-2">
                  <span className="text-sm text-white/80">{selectedIds.size} items selected</span>
                  <Button
                    size="sm"
                    onClick={() => setDeleteTarget('bulk')}
                    className="bg-red-600 hover:bg-red-700 text-white h-7 px-3 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete Selected
                  </Button>
                </div>
              )}
            </div>

            {/* Grid view */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {paginated.map((item) => {
                  const selected = selectedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`group relative rounded-lg overflow-hidden border bg-[#1a3a33] transition-all ${
                        selected
                          ? 'border-[#C9A05B] ring-2 ring-[#C9A05B]'
                          : 'border-[#C9A05B]/20'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelect(item.id)}
                          className="accent-[#C9A05B] h-4 w-4"
                        />
                      </div>

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
                          onClick={() => setDeleteTarget(item.id)}
                          className="h-7 w-7 p-0 bg-black/60 text-red-400 hover:bg-black/80"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List view */}
            {viewMode === 'list' && (
              <div className="flex flex-col gap-2">
                {paginated.map((item) => {
                  const selected = selectedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 bg-[#1a3a33] rounded px-4 py-3 border transition-all ${
                        selected ? 'border-[#C9A05B]/60 ring-1 ring-[#C9A05B]' : 'border-[#C9A05B]/10'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelect(item.id)}
                        className="accent-[#C9A05B] h-4 w-4 flex-shrink-0"
                      />
                      {/* Thumbnail */}
                      <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-[#0F2C23]/60 flex items-center justify-center">
                        {item.type === 'video' ? (
                          <Film className="w-5 h-5 text-[#C9A05B]/60" />
                        ) : (
                          <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                        )}
                      </div>
                      {/* Alt */}
                      <p className="flex-1 text-sm text-white/80 truncate min-w-0">{item.alt || '—'}</p>
                      {/* Section badge */}
                      <span className="text-xs bg-[#0F2C23] text-[#C9A05B] px-2 py-0.5 rounded capitalize flex-shrink-0">
                        {item.section}
                      </span>
                      {/* Area */}
                      <span className="text-xs text-white/50 w-28 truncate flex-shrink-0">{item.area || '—'}</span>
                      {/* Type badge */}
                      <span className="text-xs bg-[#C9A05B]/10 text-[#C9A05B] px-2 py-0.5 rounded capitalize flex-shrink-0">
                        {item.type}
                      </span>
                      {/* Date */}
                      <span className="text-xs text-white/40 w-24 flex-shrink-0 hidden sm:block">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(item)}
                          className="h-7 w-7 p-0 text-[#C9A05B] hover:bg-[#C9A05B]/10"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(item.id)}
                          className="h-7 w-7 p-0 text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="border-[#C9A05B]/30 text-white/70 hover:text-white disabled:opacity-30"
                >
                  Previous
                </Button>
                <span className="text-sm text-white/60">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="border-[#C9A05B]/30 text-white/70 hover:text-white disabled:opacity-30"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
