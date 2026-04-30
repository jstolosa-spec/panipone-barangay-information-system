import React, { useState } from 'react';
import { Search, UserPlus, Shield, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api-client';
import type { User, UserRole } from '@shared/types';
import { toast } from 'sonner';
export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ items: User[] }>({
    queryKey: ['users', roleFilter],
    queryFn: () => api<{ items: User[] }>(`/api/users?role=${roleFilter}`),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, role }: { id: string, role: UserRole }) => 
      api<User>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify({ role }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated');
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User removed from registry');
    }
  });
  const filteredUsers = data?.items.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    api<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role')
      })
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsRegisterOpen(false);
      toast.success('Resident registered successfully');
    });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Barangay Registry</h1>
            <p className="text-muted-foreground">Manage resident profiles and staff credentials.</p>
          </div>
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" /> Register Resident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resident Registration</DialogTitle>
                <DialogDescription>
                  Fill in the resident's details to add them to the official barangay registry.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="name" placeholder="Juan Dela Cruz" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input name="email" type="email" placeholder="juan@example.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Role</label>
                  <select name="role" className="w-full h-10 border rounded-md px-3 text-sm">
                    <option value="resident">Resident</option>
                    <option value="secretary">Secretary</option>
                    <option value="kagawad">Kagawad</option>
                  </select>
                </div>
                <Button type="submit" className="w-full mt-2">Create Profile</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="h-10 border rounded-md px-3 bg-background text-sm min-w-[150px]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="resident">Residents</option>
            <option value="secretary">Secretaries</option>
            <option value="kagawad">Kagawads</option>
            <option value="captain">Captain</option>
          </select>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateMutation.mutate({ id: user.id, role: 'kagawad' })}>
                            Promote to Kagawad
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateMutation.mutate({ id: user.id, role: 'secretary' })}>
                            Promote to Secretary
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateMutation.mutate({ id: user.id, role: 'resident' })}>
                            Set as Resident
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => { if(confirm('Remove user?')) deleteMutation.mutate(user.id); }}
                          >
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}