import React, { useState } from 'react';
import { Search, MapPin, Phone, User as UserIcon, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth';
import type { DirectoryPost } from '@shared/types';
import { toast } from 'sonner';
export function DirectoryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentUser = useAuthStore(s => s.currentUser);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ items: DirectoryPost[] }>({
    queryKey: ['posts', activeTab],
    queryFn: () => api<{ items: DirectoryPost[] }>(`/api/posts?category=${activeTab}`),
  });
  const mutation = useMutation({
    mutationFn: (newPost: Partial<DirectoryPost>) => api<DirectoryPost>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsDialogOpen(false);
      toast.success('Listing added successfully!');
    },
    onError: () => toast.error('Failed to add listing'),
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Local Directory</h1>
          <p className="text-muted-foreground">Find local services, skills, and businesses in Barangay Panipuan.</p>
        </div>
        {currentUser && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Listing</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddListing} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input name="title" placeholder="Business or Service name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select name="category" className="w-full border rounded-md h-10 px-3">
                    <option value="service">Service</option>
                    <option value="business">Business</option>
                    <option value="skill">Skill</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input name="description" placeholder="Short description" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Number</label>
                  <Input name="contact" placeholder="09XX XXX XXXX" required />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={mutation.isPending}>Submit</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for skills, services, or shops..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 h-11">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="service">Services</TabsTrigger>
            <TabsTrigger value="business">Businesses</TabsTrigger>
            <TabsTrigger value="skill">Skills</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover-card-blue overflow-hidden group">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-1581578731522-aa02a1e1272b?q=80&w=400`}
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-[10px] font-bold rounded uppercase tracking-wider shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <UserIcon className="h-3 w-3" />
                  <span>{post.ownerName}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{post.contact}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">Contact</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No listings found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}