import React, { useState } from 'react';
import { Search, MapPin, Phone, User as UserIcon, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_POSTS } from '@shared/mock-data';
export function DirectoryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesTab = activeTab === 'all' || post.category === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Local Directory</h1>
          <p className="text-muted-foreground">Find local services, skills, and businesses in Barangay Panipuan.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Listing
        </Button>
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
      {filteredPosts.length > 0 ? (
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