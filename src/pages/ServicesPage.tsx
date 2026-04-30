import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api-client';
import type { DocumentRequest } from '@shared/types';
import { toast } from 'sonner';
export function ServicesPage() {
  const currentUser = useAuthStore(s => s.currentUser);
  const [view, setView] = useState<'list' | 'create'>('list');
  const queryClient = useQueryClient();
  const isAdminOrStaff = currentUser?.role && ['admin', 'captain', 'secretary'].includes(currentUser.role);
  const queryUrl = isAdminOrStaff ? '/api/requests' : `/api/requests?residentId=${currentUser?.id}`;
  const { data, isLoading } = useQuery<{ items: DocumentRequest[] }>({
    queryKey: ['requests', currentUser?.id],
    queryFn: () => api<{ items: DocumentRequest[] }>(queryUrl),
    enabled: !!currentUser
  });
  const createMutation = useMutation({
    mutationFn: (newReq: Partial<DocumentRequest>) => api<DocumentRequest>('/api/requests', {
      method: 'POST',
      body: JSON.stringify(newReq)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setView('list');
      toast.success('Request submitted successfully!');
    }
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => api<DocumentRequest>(`/api/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request status updated');
    }
  });
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      type: formData.get('type') as any,
      purpose: formData.get('purpose') as string,
      residentId: currentUser?.id,
      residentName: currentUser?.name
    });
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Services</h1>
          <p className="text-muted-foreground">Manage and request official barangay documents.</p>
        </div>
        {!isAdminOrStaff && view === 'list' && (
          <Button onClick={() => setView('create')} className="gap-2">
            <Plus className="h-4 w-4" /> New Request
          </Button>
        )}
      </div>
      {view === 'create' ? (
        <Card className="max-w-2xl mx-auto border-blue-100">
          <CardHeader>
            <CardTitle>Request New Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Document Type</label>
                  <select name="type" className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="clearance">Barangay Clearance</option>
                    <option value="certificate">Certificate of Indigency</option>
                    <option value="permit">Business Permit</option>
                    <option value="residency">Residency Certificate</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Purpose of Request</label>
                  <textarea
                    name="purpose"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="E.g. Job Application, Loan Requirement..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Supporting Documents (Optional)</label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary mb-2" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG (Max 5MB)</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setView('list')}>Cancel</Button>
                <Button type="submit" className="px-8" disabled={createMutation.isPending}>Submit Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold">
              {isAdminOrStaff ? 'All Incoming Requests' : 'My Requests'}
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search requests..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Type</TableHead>
                    {isAdminOrStaff && <TableHead>Resident</TableHead>}
                    <TableHead>Purpose</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        {isAdminOrStaff && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : data?.items.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-semibold capitalize">{req.type}</TableCell>
                      {isAdminOrStaff && <TableCell>{req.residentName}</TableCell>}
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{req.purpose}</TableCell>
                      <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          req.status === 'approved' ? 'default' :
                          req.status === 'pending' ? 'outline' : 'destructive'
                        } className="capitalize gap-1">
                          {req.status === 'pending' && <Clock className="h-3 w-3" />}
                          {req.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                          {req.status === 'rejected' && <XCircle className="h-3 w-3" />}
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {isAdminOrStaff && req.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                              onClick={() => statusMutation.mutate({ id: req.id, status: 'approved' })}
                              disabled={statusMutation.isPending}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-destructive border-red-200 bg-red-50 hover:bg-red-100"
                              onClick={() => statusMutation.mutate({ id: req.id, status: 'rejected' })}
                              disabled={statusMutation.isPending}
                            >
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}