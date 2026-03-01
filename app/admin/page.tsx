// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  LogOut,
  Users,
  Home,
  FileText,
  Settings,
  Building2,
  TrendingUp,
  ImageIcon,
  Activity,
  Circle,
} from 'lucide-react';
import { toast } from 'sonner';

type ActivityItem = {
  id: string;
  label: string;
  type: 'apartment' | 'blog' | 'media';
  createdAt: string;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    apartments: 0,
    blogPosts: 0,
    mediaItems: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(false);

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

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/admin/activity');
        if (!res.ok) throw new Error('Failed to load activity');
        const data = await res.json();
        setActivity(data);
      } catch (err) {
        console.error(err);
        setActivityError(true);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
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

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1a3a33] to-[#2a4a43] rounded-lg p-6 mb-10 flex items-center gap-4">
          <Building2 className="h-10 w-10 text-[#C9A05B] shrink-0" />
          <div>
            <p className="text-xl font-medium">{getGreeting()}, Admin!</p>
            <p className="text-sm opacity-70 mt-1">{currentDate}</p>
          </div>
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
              <div className="flex items-center gap-1 mt-2 text-green-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                +2 this month
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/10">
                <div className="h-1 rounded-full bg-[#C9A05B]/40 w-3/4" />
              </div>
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
              <div className="flex items-center gap-1 mt-2 text-green-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                +2 this month
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/10">
                <div className="h-1 rounded-full bg-[#C9A05B]/40 w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#C9A05B]" />
                Media Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light">{stats.mediaItems}</div>
              <p className="text-sm opacity-70 mt-1">Photos &amp; videos</p>
              <div className="flex items-center gap-1 mt-2 text-green-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                +2 this month
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/10">
                <div className="h-1 rounded-full bg-[#C9A05B]/40 w-4/5" />
              </div>
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
              <div className="flex items-center gap-1 mt-2 text-green-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                +2 this month
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/10">
                <div className="h-1 rounded-full bg-[#C9A05B]/40 w-1/4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#C9A05B]" />
            Recent Activity
          </h2>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              {activityLoading ? (
                <p className="text-sm opacity-60">Loading activity...</p>
              ) : activityError ? (
                <p className="text-sm opacity-60">Could not load recent activity.</p>
              ) : activity.length === 0 ? (
                <p className="text-sm opacity-60">No recent activity found.</p>
              ) : (
                <ul className="space-y-4">
                  {activity.map((item) => (
                    <li key={item.id} className="flex items-center gap-4">
                      <div className="shrink-0 text-[#C9A05B]">
                        {item.type === 'apartment' && <Building2 className="h-5 w-5" />}
                        {item.type === 'blog' && <FileText className="h-5 w-5" />}
                        {item.type === 'media' && <ImageIcon className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.label}</p>
                        <p className="text-xs opacity-50 capitalize">{item.type}</p>
                      </div>
                      <span className="text-xs opacity-50 shrink-0">{timeAgo(item.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <h2 className="text-2xl font-light mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link href="/admin/apartments">
            <Card className="bg-gradient-to-br from-[#1a3a33] to-[#0F2C23] hover:from-[#2a4a43] hover:to-[#1a3a33] transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-[#C9A05B]/20 h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <Home className="h-10 w-10 text-[#C9A05B] mb-4" />
                <h3 className="text-xl font-medium mb-1">Apartments</h3>
                <p className="text-xs text-[#C9A05B] opacity-70 mb-2">{stats.apartments} listings</p>
                <p className="opacity-80 text-sm">
                  Add, edit or remove apartment listings and pricing
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blog">
            <Card className="bg-gradient-to-br from-[#1a3a33] to-[#0F2C23] hover:from-[#2a4a43] hover:to-[#1a3a33] transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-[#C9A05B]/20 h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <FileText className="h-10 w-10 text-[#C9A05B] mb-4" />
                <h3 className="text-xl font-medium mb-1">Blog / News</h3>
                <p className="text-xs text-[#C9A05B] opacity-70 mb-2">{stats.blogPosts} articles</p>
                <p className="opacity-80 text-sm">
                  Create and manage articles, news &amp; updates
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/gallery">
            <Card className="bg-gradient-to-br from-[#1a3a33] to-[#0F2C23] hover:from-[#2a4a43] hover:to-[#1a3a33] transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-[#C9A05B]/20 h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <ImageIcon className="h-10 w-10 text-[#C9A05B] mb-4" />
                <h3 className="text-xl font-medium mb-1">Gallery</h3>
                <p className="text-xs text-[#C9A05B] opacity-70 mb-2">{stats.mediaItems} items</p>
                <p className="opacity-80 text-sm">
                  Upload and organize photos &amp; videos
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="bg-gradient-to-br from-[#1a3a33] to-[#0F2C23] hover:from-[#2a4a43] hover:to-[#1a3a33] transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-[#C9A05B]/20 h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <Settings className="h-10 w-10 text-[#C9A05B] mb-4" />
                <h3 className="text-xl font-medium mb-1">Site Settings</h3>
                <p className="text-xs text-[#C9A05B] opacity-70 mb-2">{stats.users} accounts</p>
                <p className="opacity-80 text-sm">
                  Hero text, contact info, colors &amp; more
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* System Status Bar */}
        <div className="mt-12 bg-white/5 rounded-lg p-4">
          <p className="text-sm font-medium opacity-80 mb-3">System Status</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-3 w-3 fill-green-400 text-green-400" />
              <span className="opacity-70">Database</span>
              <span className="text-green-400 text-xs">Connected</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="opacity-70">Storage</span>
              <span className="text-yellow-400 text-xs">72% used</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-3 w-3 fill-blue-400 text-blue-400" />
              <span className="opacity-70">Last Backup</span>
              <span className="text-blue-400 text-xs">Today, 03:00 UTC</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center opacity-60 text-sm">
          © {new Date().getFullYear()} Josephine Haven · Admin Panel · v1.0.0
        </div>
      </div>
    </div>
  );
}
