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
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function AdminBlog() {
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPosts(data);
    } catch {
      toast.error('Could not load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      // Auto-generate slug only when not editing (don't overwrite manual slug on edits)
      slug: editing ? prev.slug : slugify(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      toast.info('Uploading image...');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
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
      const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Operation failed');
      }
      toast.success(editing ? 'Post updated' : 'Post created');
      setOpen(false);
      resetForm();
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Post deleted');
      fetchPosts();
    } catch {
      toast.error('Could not delete post');
    }
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      image: post.image,
      category: post.category,
      published: post.published,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setForm({ title: '', slug: '', content: '', image: '', category: '', published: true });
    setEditing(null);
  };

  return (
    <div className="p-8 bg-[#0F2C23] text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-light">Manage Blog / News</h1>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gold-btn">
                <Plus className="mr-2 h-4 w-4" /> Add Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-[#1a3a33] text-white border-[#C9A05B]/30">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editing ? 'Edit Post' : 'New Post'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">Title *</label>
                    <Input
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Slug *</label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      required
                      className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Category *</label>
                    <Input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                      className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="published"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A05B]"
                    />
                    <label htmlFor="published" className="text-sm">Published</label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Content *</label>
                  <Textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={6}
                    required
                    className="bg-[#0F2C23]/70 border-[#C9A05B]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-[#0F2C23]/70 border-[#C9A05B]/30 max-w-sm"
                    />
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
          <div className="text-center py-20">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 opacity-70">No posts yet. Add one above.</div>
        ) : (
          <div className="rounded-md border border-[#C9A05B]/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#1a3a33]">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
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
                    <TableCell className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(post)}
                        className="text-[#C9A05B] hover:text-[#C9A05B]/80 hover:bg-[#C9A05B]/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
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
