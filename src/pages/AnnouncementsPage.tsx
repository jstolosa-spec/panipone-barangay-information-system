import React from 'react';
import { Megaphone, Plus, Calendar, User as UserIcon, Pin, MoreHorizontal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_ANNOUNCEMENTS } from '@shared/mock-data';
import { useAuthStore } from '@/store/auth';
export function AnnouncementsPage() {
  const currentUser = useAuthStore(s => s.currentUser);
  const canPost = currentUser?.role && ['admin', 'captain', 'secretary', 'kagawad'].includes(currentUser.role);
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Announcements</h1>
          <p className="text-muted-foreground">Stay informed about the latest news and events in Barangay Panipuan.</p>
        </div>
        {canPost && (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Post Announcement
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-8">
        {MOCK_ANNOUNCEMENTS.map((ann) => (
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