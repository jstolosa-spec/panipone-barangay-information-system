import React, { useState } from 'react';
import { Megaphone, Plus, Calendar, User as UserIcon, Pin, MoreHorizontal } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api-client';
import type { Announcement, ApiResponse } from '@shared/types';
import { toast } from 'sonner';
export function AnnouncementsPage() {
  const currentUser = useAuthStore(s => s.currentUser);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const canPost = currentUser?.role && ['admin', 'captain', 'secretary', 'kagawad'].includes(currentUser.role);
  const { data, isLoading } = useQuery<{ items: Announcement[] }>({
    queryKey: ['announcements'],
    queryFn: () => api<{ items: Announcement[] }>('/api/announcements'),
  });
  const mutation = useMutation({
    mutationFn: (newAnn: Partial<Announcement>) => api<Announcement>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(newAnn)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsDialogOpen(false);
      toast.success('Announcement posted successfully!');
    },
    onError: () => toast.error('Failed to post announcement'),
  });
  const handlePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      authorId: currentUser?.id,
      authorName: currentUser?.name,
      authorRole: currentUser?.role,
      isPinned: formData.get('isPinned') === 'on'
    });
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Announcements</h1>
          <p className="text-muted-foreground">Stay informed about the latest news and events in Barangay Panipuan.</p>
        </div>
        {canPost && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Post Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Announcement</DialogTitle>
                <DialogDescription>
                  Draft and publish a new announcement to be broadcasted to the community.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePost} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input name="title" placeholder="Announcement title" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea name="content" placeholder="Details..." className="min-h-[120px]" required />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isPinned" id="isPinned" className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="isPinned" className="text-sm font-medium">Pin this announcement</label>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={mutation.isPending}>Post Now</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/6" />
                </div>
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </Card>
          ))
        ) : data?.items.map((ann) => (
          <Card key={ann.id} className={`hover-card-blue relative overflow-hidden ${ann.isPinned ? 'border-amber-200 bg-amber-50/20 dark:bg-amber-900/10' : ''}`}>
            {ann.isPinned && (
              <div className="absolute top-0 right-0 p-3">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 flex gap-1">
                  <Pin className="h-3 w-3" /> Pinned
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    {ann.authorName}
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight py-0">
                      {ann.authorRole}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {new Date(ann.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl mt-4">{ann.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground leading-relaxed">
                {ann.content}
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between items-center text-muted-foreground">
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                  <Megaphone className="h-4 w-4" /> Share
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}