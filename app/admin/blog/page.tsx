// app/admin/blog/page.tsx
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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText, LayoutList } from 'lucide-react';

// ─── Blog Post types ─────────────────────────────────────────────────────────
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  published: boolean;
  createdAt: string;
};

// ─── Journal Marketing Card types ────────────────────────────────────────────
type MarketingCard = {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  buttonLabel: string;
  subject: string;
  order: number;
  isActive: boolean;
};

type JournalHero = {
  journalHeroLabel: string;
  journalHeroTitle: string;
  journalHeroDescription: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ══════════════════════════════════════════════════════════════════════════════
// Blog Posts Tab
// ══════════════════════════════════════════════════════════════════════════════
function BlogPostsTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    image: '',
    category: '',
    published: true,
  });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (!res.ok) throw new Error('Failed to fetch');
      setPosts(await res.json());
    } catch { toast.error('Could not load blog posts'); }
    finally { setLoading(false); }
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: editing && prev.slug ? prev.slug : slugify(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      toast.info('Uploading image...');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) { setForm(prev => ({ ...prev, image: data.url })); toast.success('Image uploaded'); }
      else toast.error(data.error);
    } catch { toast.error('Upload failed'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Operation failed'); }
      toast.success(editing ? 'Post updated' : 'Post created');
      setOpen(false); resetForm(); fetchPosts();
    } catch (err) { toast.error((err as Error).message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Post deleted'); fetchPosts();
    } catch { toast.error('Could not delete post'); }
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ title: post.title, slug: post.slug, content: post.content, image: post.image, category: post.category, published: post.published });
    setOpen(true);
  };

  const resetForm = () => {
    setForm({ title: '', slug: '', content: '', image: '', category: '', published: true });
    setEditing(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light">Blog Posts</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gold-btn"><Plus className="mr-2 h-4 w-4" /> Add Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-[#1a3a33] text-white border-[#C9A05B]/30 max-h-[90vh] flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle className="text-2xl">{editing ? 'Edit Post' : 'New Post'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 space-y-6 mt-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">Title *</label>
                  <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required className="bg-[#0F2C23]/70 border-[#C9A05B]/30" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Slug *</label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="bg-[#0F2C23]/70 border-[#C9A05B]/30" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Category / Tag *</label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="bg-[#0F2C23]/70 border-[#C9A05B]/30" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-[#C9A05B]" />
                  <label htmlFor="published" className="text-sm">Published</label>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Content *</label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} required className="bg-[#0F2C23]/70 border-[#C9A05B]/30" />
              </div>
              <div>
                <label className="block text-sm mb-3">Card Image</label>
                {/* Clickable upload zone with live preview */}
                <label className="group relative block w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-[#C9A05B]/30 hover:border-[#C9A05B] cursor-pointer transition-colors bg-[#0F2C23]/40">
                  {form.image ? (
                    <>
                      <img src={form.image} alt="Card preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" /></svg>
                        <span className="text-white text-xs font-medium">Click to change image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C9A05B]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" /></svg>
                      <span className="text-sm text-gray-400">Click to upload card image</span>
                      <span className="text-xs text-gray-500">JPG, PNG, WEBP recommended</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </label>
                <Input
                  className="mt-2 bg-[#0F2C23]/70 border-[#C9A05B]/30 text-xs text-gray-400"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Or paste an image URL directly"
                />
              </div>
              <DialogFooter className="sticky bottom-0 bg-[#1a3a33] pt-4 border-t border-[#C9A05B]/10 shrink-0">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="gold-btn">{editing ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 opacity-70">No posts yet. Add one above.</div>
      ) : (
        <div className="rounded-md border border-[#C9A05B]/20 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1a3a33]">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category / Tag</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="hover:bg-[#1a3a33]/50">
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell className="text-xs text-gray-400">{post.slug}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(post)} className="text-[#C9A05B] hover:text-[#C9A05B]/80 hover:bg-[#C9A05B]/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
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
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Journal Page Tab
// ══════════════════════════════════════════════════════════════════════════════
function JournalPageTab() {
  const [hero, setHero] = useState<JournalHero>({
    journalHeroLabel: '',
    journalHeroTitle: '',
    journalHeroDescription: '',
  });
  const [savingHero, setSavingHero] = useState(false);

  const [cards, setCards] = useState<MarketingCard[]>([]);
  const [cardOpen, setCardOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<MarketingCard | null>(null);
  const [cardForm, setCardForm] = useState({
    tag: '',
    title: '',
    description: '',
    image: '',
    buttonLabel: 'Send Enquiry',
    subject: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchSettings();
    fetchCards();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setHero({
          journalHeroLabel: data.journalHeroLabel || 'Our Stories',
          journalHeroTitle: data.journalHeroTitle || 'The Journal',
          journalHeroDescription: data.journalHeroDescription || 'Stay updated with the latest happenings, exclusive offers, and stories from our haven.',

        });
      }
    } catch { toast.error('Could not load journal settings'); }
  };

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/admin/journal-cards');
      setCards(await res.json());
    } catch { toast.error('Could not load marketing cards'); }
  };

  const saveHero = async () => {
    setSavingHero(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });
      if (res.ok) toast.success('Journal hero section saved!');
      else toast.error('Failed to save hero settings');
    } catch { toast.error('An error occurred'); }
    finally { setSavingHero(false); }
  };

  const handleCardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      toast.info('Uploading image...');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) { setCardForm(prev => ({ ...prev, image: data.url })); toast.success('Image uploaded'); }
      else toast.error(data.error);
    } catch { toast.error('Upload failed'); }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCard ? 'PUT' : 'POST';
      const url = editingCard ? `/api/admin/journal-cards/${editingCard.id}` : '/api/admin/journal-cards';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardForm),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Operation failed'); }
      toast.success(editingCard ? 'Card updated!' : 'Card created!');
      setCardOpen(false); resetCardForm(); fetchCards();
    } catch (err) { toast.error((err as Error).message); }
  };

  const handleCardDelete = async (id: string) => {
    if (!confirm('Delete this marketing card?')) return;
    try {
      await fetch(`/api/admin/journal-cards/${id}`, { method: 'DELETE' });
      toast.success('Card deleted'); fetchCards();
    } catch { toast.error('Could not delete card'); }
  };

  const startEditCard = (card: MarketingCard) => {
    setEditingCard(card);
    setCardForm({
      tag: card.tag,
      title: card.title,
      description: card.description,
      image: card.image,
      buttonLabel: card.buttonLabel,
      subject: card.subject,
      order: card.order,
      isActive: card.isActive,
    });
    setCardOpen(true);
  };

  const resetCardForm = () => {
    setCardForm({ tag: '', title: '', description: '', image: '', buttonLabel: 'Send Enquiry', subject: '', order: 0, isActive: true });
    setEditingCard(null);
  };

  return (
    <div className="space-y-10">

      {/* ── Hero Section ─── */}
      <div className="bg-[#1a3a33] rounded-xl p-8 border border-[#C9A05B]/20">
        <h2 className="text-2xl font-light mb-2">Journal Hero Section</h2>
        <p className="text-sm text-gray-400 mb-6">Controls the top banner text on the public /journal page.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Label <span className="text-[10px] text-gray-500 normal-case">(small eyebrow text, e.g. "Our Stories")</span></Label>
            <Input
              value={hero.journalHeroLabel}
              onChange={e => setHero(p => ({ ...p, journalHeroLabel: e.target.value }))}
              className="bg-[#0F2C23]/70 border-[#C9A05B]/30 text-white"
              placeholder="Our Stories"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Page Title <span className="text-[10px] text-gray-500 normal-case">(large heading, e.g. "The Journal")</span></Label>
            <Input
              value={hero.journalHeroTitle}
              onChange={e => setHero(p => ({ ...p, journalHeroTitle: e.target.value }))}
              className="bg-[#0F2C23]/70 border-[#C9A05B]/30 text-white"
              placeholder="The Journal"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-300">Description Paragraph</Label>
            <Textarea
              value={hero.journalHeroDescription}
              onChange={e => setHero(p => ({ ...p, journalHeroDescription: e.target.value }))}
              rows={3}
              className="bg-[#0F2C23]/70 border-[#C9A05B]/30 text-white resize-none"
              placeholder="Stay updated with the latest happenings..."
            />
          </div>
        </div>
        <Button onClick={saveHero} disabled={savingHero} className="gold-btn mt-6">
          {savingHero ? 'Saving...' : 'Save Hero Section'}
        </Button>
      </div>

      {/* ── Marketing Cards ─── */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light">Marketing Cards</h2>
            <p className="text-sm text-gray-400 mt-1">Manage the 3 promotional cards that appear in the Journal grid (Oldies Night, Gastronomy, Workspaces, etc.)</p>
          </div>
          <Dialog open={cardOpen} onOpenChange={(o) => { setCardOpen(o); if (!o) resetCardForm(); }}>
            <DialogTrigger asChild>
              <Button className="gold-btn"><Plus className="mr-2 h-4 w-4" /> Add Card</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#1a3a33] text-white border-[#C9A05B]/30 max-h-[90vh] flex flex-col">
              <DialogHeader className="shrink-0">
                <DialogTitle className="text-2xl">{editingCard ? 'Edit Marketing Card' : 'New Marketing Card'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCardSubmit} className="flex-1 overflow-y-auto pr-2 space-y-5 mt-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tag / Label <span className="text-[10px] text-gray-400">(e.g. "The Highlight")</span></Label>
                    <Input value={cardForm.tag} onChange={e => setCardForm(p => ({ ...p, tag: e.target.value }))} className="bg-[#0F2C23]/70 border-[#C9A05B]/30" placeholder="The Highlight" />
                  </div>
                  <div className="space-y-2">
                    <Label>Card Title *</Label>
                    <Input value={cardForm.title} onChange={e => setCardForm(p => ({ ...p, title: e.target.value }))} required className="bg-[#0F2C23]/70 border-[#C9A05B]/30" placeholder="Saturday Oldies Night" />
                    <p className="text-[10px] text-gray-500">Use \n for a line break in the title</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description *</Label>
                    <Textarea value={cardForm.description} onChange={e => setCardForm(p => ({ ...p, description: e.target.value }))} required rows={3} className="bg-[#0F2C23]/70 border-[#C9A05B]/30 resize-none" placeholder="A curated nostalgic journey through sound and soul..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Label</Label>
                    <Input value={cardForm.buttonLabel} onChange={e => setCardForm(p => ({ ...p, buttonLabel: e.target.value }))} className="bg-[#0F2C23]/70 border-[#C9A05B]/30" placeholder="Reserve Seat" />
                  </div>
                  <div className="space-y-2">
                    <Label>Inquiry Subject <span className="text-[10px] text-gray-400">(pre-fills form)</span></Label>
                    <Input value={cardForm.subject} onChange={e => setCardForm(p => ({ ...p, subject: e.target.value }))} className="bg-[#0F2C23]/70 border-[#C9A05B]/30" placeholder="Seat Reservation: Oldies Night" />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input type="number" value={cardForm.order} onChange={e => setCardForm(p => ({ ...p, order: Number(e.target.value) }))} className="bg-[#0F2C23]/70 border-[#C9A05B]/30" />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" id="cardActive" checked={cardForm.isActive} onChange={e => setCardForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-[#C9A05B]" />
                    <label htmlFor="cardActive" className="text-sm">Active (visible on site)</label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background Image <span className="text-[10px] text-gray-400">(optional — used when card has a photo background)</span></Label>
                  <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" onChange={handleCardImageUpload} className="bg-[#0F2C23]/70 border-[#C9A05B]/30 max-w-xs" />
                    {cardForm.image && <img src={cardForm.image} alt="Preview" className="h-10 w-16 object-cover rounded shadow" />}
                  </div>
                  <Input value={cardForm.image} onChange={e => setCardForm(p => ({ ...p, image: e.target.value }))} className="mt-1 bg-[#0F2C23]/70 border-[#C9A05B]/30 text-xs text-gray-400" placeholder="Or paste image URL" />
                </div>
                <DialogFooter className="sticky bottom-0 bg-[#1a3a33] pt-4 border-t border-[#C9A05B]/10 shrink-0">
                  <Button type="button" variant="outline" onClick={() => setCardOpen(false)}>Cancel</Button>
                  <Button type="submit" className="gold-btn">{editingCard ? 'Update Card' : 'Create Card'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-16 opacity-60 border border-[#C9A05B]/10 rounded-xl">
            No marketing cards yet. The 3 default cards (Oldies Night, Gastronomy, Workspaces) will show until you add some here.
          </div>
        ) : (
          <div className="rounded-md border border-[#C9A05B]/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#1a3a33]">
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Button Label</TableHead>
                  <TableHead>Inquiry Subject</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cards.map((card) => (
                  <TableRow key={card.id} className="hover:bg-[#1a3a33]/50">
                    <TableCell className="text-gray-400">{card.order}</TableCell>
                    <TableCell><span className="text-xs bg-[#C9A05B]/10 text-[#C9A05B] px-2 py-0.5 rounded-full">{card.tag || '—'}</span></TableCell>
                    <TableCell className="font-medium max-w-[180px] truncate">{card.title.replace(/\\n/g, ' ')}</TableCell>
                    <TableCell className="text-sm text-gray-300">{card.buttonLabel}</TableCell>
                    <TableCell className="text-xs text-gray-400 max-w-[200px] truncate">{card.subject}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${card.isActive ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                        {card.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => startEditCard(card)} className="text-[#C9A05B] hover:text-[#C9A05B]/80 hover:bg-[#C9A05B]/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleCardDelete(card.id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
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

// ══════════════════════════════════════════════════════════════════════════════
// Root Page with Tabs
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminBlog() {
  const [tab, setTab] = useState<'posts' | 'journal'>('posts');

  return (
    <div className="p-8 bg-[#0F2C23] text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light mb-8">Blog &amp; Journal Management</h1>

        {/* Tab bar */}
        <div className="flex gap-2 mb-10 border-b border-[#C9A05B]/20 pb-0">
          <button
            onClick={() => setTab('posts')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all ${tab === 'posts'
              ? 'bg-[#1a3a33] text-[#C9A05B] border border-b-0 border-[#C9A05B]/20'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <FileText className="h-4 w-4" /> Blog Posts
          </button>
          <button
            onClick={() => setTab('journal')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all ${tab === 'journal'
              ? 'bg-[#1a3a33] text-[#C9A05B] border border-b-0 border-[#C9A05B]/20'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <LayoutList className="h-4 w-4" /> Journal Page
          </button>
        </div>

        <div className="bg-[#0F2C23] mt-2">
          {tab === 'posts' ? <BlogPostsTab /> : <JournalPageTab />}
        </div>
      </div>
    </div>
  );
}
