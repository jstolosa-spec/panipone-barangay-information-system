import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, FileText, Megaphone, ArrowRight, User as UserIcon, Calendar, Pin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Announcement } from '@shared/types';
export function HomePage() {
  const { data, isLoading } = useQuery<{ items: Announcement[] }>({
    queryKey: ['announcements', 'public'],
    queryFn: () => api<{ items: Announcement[] }>('/api/announcements'),
  });
  const publicAnnouncements = data?.items.filter(a => a.isPublic).slice(0, 3) ?? [];
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient pt-24 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm mb-6 animate-fade-in">
            <ShieldCheck className="h-4 w-4" />
            <span>Official Portal of Barangay Panipuan</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight animate-slide-up">
            Digital Governance <br /> <span className="text-blue-400">for our Community</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access barangay services, stay updated with announcements, and connect with local businesses—all in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-500 text-white border-none h-14 px-8 rounded-full shadow-lg shadow-blue-500/25">
              <Link to="/login" className="flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white/20 bg-white/10 hover:bg-white/20 h-14 px-8 rounded-full backdrop-blur-sm">
              <a href="#about">Learn More</a>
            </Button>
          </div>
        </div>
      </section>
      {/* Announcements Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Recent Announcements</h2>
            <p className="text-muted-foreground mt-2">The latest news and updates from the barangay council.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/login">View all announcements</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="h-full flex flex-col p-6 space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))
          ) : publicAnnouncements.length > 0 ? (
            publicAnnouncements.map((ann) => (
              <Card key={ann.id} className="hover-card-blue flex flex-col relative overflow-hidden group">
                {ann.isPinned && (
                  <div className="absolute top-3 right-3">
                    <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                      {ann.authorRole}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">{ann.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{ann.content}</p>
                </CardContent>
                <div className="px-6 py-4 border-t bg-muted/20 mt-auto flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="h-3 w-3" />
                    <span>{ann.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No recent announcements to display.
            </div>
          )}
        </div>
      </section>
      {/* Services Grid */}
      <section id="about" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering Residents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Modern tools designed to make interacting with your local government seamless and efficient.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Document Services', desc: 'Request barangay clearances and certificates online with status tracking.', icon: FileText },
              { title: 'Local Directory', desc: 'Find local businesses and skilled services within our barangay community.', icon: BookOpen },
              { title: 'Instant News', desc: 'Receive important alerts and community updates directly on your dashboard.', icon: Megaphone }
            ].map((s, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="h-16 w-16 rounded-2xl bg-white shadow-lg text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <s.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-12 border-t text-center text-muted-foreground text-xs font-medium bg-muted/10">
        <p>&copy; {new Date().getFullYear()} Barangay Panipuan Information System. Built for Community Growth.</p>
      </footer>
    </div>
  );
}