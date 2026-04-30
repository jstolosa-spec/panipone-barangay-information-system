import React, { useState } from 'react';
import {
  FileText, Search, Plus, Upload, Clock, CheckCircle, XCircle, MoreVertical,
  ArrowLeft, Download, Info, Check
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api-client';
import type { DocumentRequest } from '@shared/types';
import { toast } from 'sonner';
export function ServicesPage() {
  const currentUser = useAuthStore(s => s.currentUser);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [selectedReq, setSelectedReq] = useState<DocumentRequest | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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
      setUploadProgress(0);
      setIsUploading(false);
      toast.success('Request submitted successfully!');
    }
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      api<DocumentRequest>(`/api/requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      if (selectedReq?.id === data.id) setSelectedReq(data);
      toast.success(`Request ${data.status}`);
    }
  });
  const handleSimulatedUpload = () => {
    setIsUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        toast.success('Attachment verified');
      }
    }, 100);
  };
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      type: formData.get('type') as any,
      purpose: formData.get('purpose') as string,
      residentId: currentUser?.id,
      residentName: currentUser?.name,
      attachments: uploadProgress === 100 ? ['verified_doc_id'] : []
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
          <Button onClick={() => setView('create')} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> New Request
          </Button>
        )}
      </div>
      {view === 'create' ? (
        <Card className="max-w-2xl mx-auto border-blue-100 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Request New Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Document Type</label>
                  <select name="type" className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
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
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                    placeholder="E.g. Job Application, Loan Requirement..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Supporting Documents</label>
                  <div 
                    onClick={handleSimulatedUpload}
                    className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group border-muted-foreground/20"
                  >
                    {uploadProgress === 100 ? (
                      <div className="space-y-2">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm font-bold text-green-700">Documents Verified</p>
                      </div>
                    ) : isUploading ? (
                      <div className="space-y-4">
                        <Progress value={uploadProgress} className="h-2 w-full" />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Verifying Documents... {uploadProgress}%</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary mb-2 transition-transform group-hover:-translate-y-1" />
                        <p className="text-sm font-medium">Click to upload ID or Proof of Residency</p>
                        <p className="text-xs text-muted-foreground mt-1">Files are analyzed for verification instantly.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setView('list')}>Cancel</Button>
                <Button type="submit" className="px-8" disabled={createMutation.isPending || (isUploading && uploadProgress < 100)}>
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-soft">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <CardTitle className="text-lg font-bold">
              {isAdminOrStaff ? 'Incoming Request Pipeline' : 'Document Request History'}
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filter by name or type..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold">Document</TableHead>
                    {isAdminOrStaff && <TableHead className="font-bold">Resident</TableHead>}
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        {isAdminOrStaff && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : data?.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isAdminOrStaff ? 5 : 4} className="h-32 text-center text-muted-foreground">
                        No requests found.
                      </TableCell>
                    </TableRow>
                  ) : data?.items.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold capitalize">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          {req.type.replace('-', ' ')}
                        </div>
                      </TableCell>
                      {isAdminOrStaff && <TableCell className="font-medium">{req.residentName}</TableCell>}
                      <TableCell className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          req.status === 'approved' ? 'default' :
                          req.status === 'pending' ? 'outline' : 'destructive'
                        } className="capitalize text-[10px] py-0 px-2 gap-1 font-bold tracking-tight">
                          {req.status === 'pending' && <Clock className="h-2.5 w-2.5" />}
                          {req.status === 'approved' && <CheckCircle className="h-2.5 w-2.5" />}
                          {req.status === 'rejected' && <XCircle className="h-2.5 w-2.5" />}
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs font-bold text-primary"
                          onClick={() => setSelectedReq(req)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Details Dialog */}
      <Dialog open={!!selectedReq} onOpenChange={(open) => !open && setSelectedReq(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="capitalize">{selectedReq?.type.replace('-', ' ')} Request</span>
              <Badge variant="outline">{selectedReq?.status}</Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedReq && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium">Resident</p>
                  <p className="font-bold">{selectedReq.residentName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Requested On</p>
                  <p className="font-bold">{new Date(selectedReq.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                <div className="p-4 bg-muted/30 rounded-lg text-sm border italic">
                  "{selectedReq.purpose}"
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Verification Attachments</p>
                {selectedReq.attachments.length > 0 ? (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50/50">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">Verification_Document.pdf</p>
                      <p className="text-[10px] text-muted-foreground">Verified System Check</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No attachments provided.</p>
                )}
              </div>
              {isAdminOrStaff && selectedReq.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      statusMutation.mutate({ id: selectedReq.id, status: 'approved' });
                      setSelectedReq(null);
                    }}
                  >
                    Approve & Sign
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => {
                      statusMutation.mutate({ id: selectedReq.id, status: 'rejected' });
                      setSelectedReq(null);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}