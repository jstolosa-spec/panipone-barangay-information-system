import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, FileText, Megaphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MOCK_ANNOUNCEMENTS } from '@shared/mock-data';
export function HomePage() {
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
            <Link to="/announcements">View all announcements</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_ANNOUNCEMENTS.map((ann) => (
            <Card key={ann.id} className="hover-card-blue flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{ann.authorRole}</span>
                  {ann.isPinned && <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] rounded-full font-bold">PINNED</span>}
                </div>
                <CardTitle className="text-xl">{ann.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm line-clamp-3">{ann.content}</p>
                <div className="mt-6 pt-4 border-t text-[10px] text-muted-foreground flex justify-between">
                  <span>Posted by {ann.authorName}</span>
                  <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* Services Grid */}
      <section id="about" className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering Residents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Modern tools designed to make interacting with your local government seamless and efficient.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Document Services</h3>
              <p className="text-muted-foreground text-sm">Request barangay clearances, certificates, and permits online with status tracking.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Directory</h3>
              <p className="text-muted-foreground text-sm">Find local businesses and skilled services within our barangay community.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Megaphone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant News</h3>
              <p className="text-muted-foreground text-sm">Receive important alerts and community updates directly on your dashboard.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-12 border-t text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Barangay Panipuan Information System. All rights reserved.</p>
      </footer>
    </div>
  );
}