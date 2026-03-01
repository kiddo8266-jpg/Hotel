// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut, Users, Home, Image, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    apartments: 0,
    blogPosts: 0,
    mediaItems: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        toast.error('Could not load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    // Clear the auth cookie
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    toast.success('Logged out successfully');
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F2C23] flex items-center justify-center text-white">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F2C23] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Josephine Haven Admin
            </h1>
            <p className="text-lg opacity-80 mt-2">
              Manage your luxury apartments website
            </p>
          </div>

          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
                <Home className="h-5 w-5 text-[#C9A05B]" />
                Apartments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light">{stats.apartments}</div>
              <p className="text-sm opacity-70 mt-1">Active listings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#C9A05B]" />
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light">{stats.blogPosts}</div>
              <p className="text-sm opacity-70 mt-1">Published articles</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
                <Image className="h-5 w-5 text-[#C9A05B]" />
                Media Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light">{stats.mediaItems}</div>
              <p className="text-sm opacity-70 mt-1">Photos & videos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#C9A05B]" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light">{stats.users}</div>
              <p className="text-sm opacity-70 mt-1">Registered accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <h2 className="text-2xl font-light mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link href="/admin/apartments">
            <Card className="bg-gradient-to-br from-[#1a3a33] to-[#0F2C23] hover:from-[#2a4a43] hover:to-[#1a3a33] transition-all cursor-pointer border border-[#C9A05B]/20 h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <Home className="h-10 w-10 text-[#C9A05B] mb-4" />
                <h3 className="text-xl font-medium mb-2">Apartments</h3>
                <p className="opacity-80 text-sm">
                  Add, edit or remove apartment listings and pricing
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blog">
            <Card className="bg-gradient-to-br from-[#1a3a33] to-[#0F2C23] hover:from-[#2a4a43] hover:to-[#1a3a33] transition-all cursor-pointer border border-[#C9A05B]/20 h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <FileText className="h-10 w-10 text-[#C9A05B] mb-4" />
                <h3 className="text-xl font-medium mb-2">Blog / News</h3>
                <p className="opacity-80 text-sm">
                  Create and manage articles, news & updates
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/gallery">
            <Card className="bg-gradient-to-br from-[#1a3a33] to-[#0F2C23] hover:from-[#2a4a43] hover:to-[#1a3a33] transition-all cursor-pointer border border-[#C9A05B]/20 h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <Image className="h-10 w-10 text-[#C9A05B] mb-4" />
                <h3 className="text-xl font-medium mb-2">Gallery</h3>
                <p className="opacity-80 text-sm">
                  Upload and organize photos & videos
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="bg-gradient-to-br from-[#1a3a33] to-[#0F2C23] hover:from-[#2a4a43] hover:to-[#1a3a33] transition-all cursor-pointer border border-[#C9A05B]/20 h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <Settings className="h-10 w-10 text-[#C9A05B] mb-4" />
                <h3 className="text-xl font-medium mb-2">Site Settings</h3>
                <p className="opacity-80 text-sm">
                  Hero text, contact info, colors & more
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center opacity-60 text-sm">
          Josephine Haven Admin Panel • Local Development
        </div>
      </div>
    </div>
  );
}