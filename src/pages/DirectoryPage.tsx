import React, { useState } from 'react';
import { Search, MapPin, Phone, User as UserIcon, Plus, Filter, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth';
import type { DirectoryPost } from '@shared/types';
import { toast } from 'sonner';
export function DirectoryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const currentUser = useAuthStore(s => s.currentUser);
  const queryClient = useQueryClient();
  const queryUrl = showMyListings && currentUser 
    ? `/api/posts?ownerId=${currentUser.id}` 
    : `/api/posts?category=${activeTab}`;
  const { data, isLoading } = useQuery<{ items: DirectoryPost[] }>({
    queryKey: ['posts', activeTab, showMyListings, currentUser?.id],
    queryFn: () => api<{ items: DirectoryPost[] }>(queryUrl),
  });
  const mutation = useMutation({
    mutationFn: (newPost: Partial<DirectoryPost>) => api<DirectoryPost>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsDialogOpen(false);
      toast.success('Your listing is now live!');
    },
  });
  const filteredPosts = data?.items.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const handleAddListing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      contact: formData.get('contact') as string,
      ownerId: currentUser?.id,
      ownerName: currentUser?.name
    });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community Directory</h1>
            <p className="text-muted-foreground italic">"Connecting Panipuan residents with local talent."</p>
          </div>
          <div className="flex gap-2">
            {currentUser && (
              <Button 
                variant={showMyListings ? "secondary" : "outline"}
                onClick={() => setShowMyListings(!showMyListings)}
                className="text-xs"
              >
                {showMyListings ? "Back to All" : "Manage My Listings"}
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/10">
                  <Plus className="h-4 w-4" /> Add Listing
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Community Listing</DialogTitle>
                  <DialogDescription>
                    Add your service, business, or skill to the public Panipuan directory.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddListing} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Listing Title</label>
                    <Input name="title" placeholder="E.g. Panipuan Auto Repair" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Category</label>
                    <select name="category" className="w-full h-11 border rounded-md px-3 text-sm">
                      <option value="service">Service (Plumbing, Electrical, etc.)</option>
                      <option value="business">Business (Store, Eatery, etc.)</option>
                      <option value="skill">Skill (Teaching, Consulting, etc.)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">About your Listing</label>
                    <Input name="description" placeholder="Short description of what you offer" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Contact Details</label>
                    <Input name="contact" placeholder="Mobile number or FB Link" required />
                  </div>
                  <Button type="submit" className="w-full mt-4" disabled={mutation.isPending}>Launch Listing</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for 'electrician', 'bakery', or 'tutor'..."
              className="pl-10 h-12 rounded-xl shadow-sm border-muted-foreground/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!showMyListings && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="grid grid-cols-4 h-12 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
                <TabsTrigger value="service" className="rounded-lg">Services</TabsTrigger>
                <TabsTrigger value="business" className="rounded-lg">Businesses</TabsTrigger>
                <TabsTrigger value="skill" className="rounded-lg">Skills</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-soft">
                <Skeleton className="aspect-video w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover-card-blue border-none shadow-soft overflow-hidden group bg-card">
                <div className="aspect-[16/9] bg-blue-50 relative overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${post.category === 'business' ? '1534723452862-4c874018d66d' : post.category === 'service' ? '1581578731522-aa02a1e1272b' : '1516321318423-f06f85e504b3'}?q=80&w=600`}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-primary hover:bg-white text-[10px] font-bold border-none backdrop-blur-sm shadow-sm">
                      {post.category.toUpperCase()}
                    </Badge>
                  </div>
                  {post.ownerId === 'admin-1' && (
                    <div className="absolute bottom-3 right-3">
                      <Badge className="bg-blue-600 text-white gap-1 py-1 px-2">
                        <ShieldCheck className="h-3 w-3" /> VERIFIED
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold line-clamp-1">{post.title}</CardTitle>
                    <div className="flex text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {post.ownerName.charAt(0)}
                    </div>
                    <span>Posted by <span className="font-semibold text-foreground">{post.ownerName}</span></span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">{post.description}</p>
                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Inquiry Contact</span>
                      <span className="text-sm font-bold text-primary">{post.contact}</span>
                    </div>
                    <Button size="sm" className="rounded-full px-4 text-xs font-bold">Contact Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-4xl border-2 border-dashed border-muted-foreground/10">
            <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">No matches found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mt-2">
              We couldn't find any listings matching your current search or filters. Try broaden your search terms!
            </p>
            <Button variant="outline" className="mt-8 rounded-full" onClick={() => { setSearchTerm(''); setActiveTab('all'); setShowMyListings(false); }}>
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}