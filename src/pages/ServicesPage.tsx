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
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';
import { MOCK_REQUESTS } from '@shared/mock-data';
export function ServicesPage() {
  const currentUser = useAuthStore(s => s.currentUser);
  const [view, setView] = useState<'list' | 'create'>('list');
  const isAdminOrStaff = currentUser?.role && ['admin', 'captain', 'secretary'].includes(currentUser.role);
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
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Document Type</label>
                <select className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Barangay Clearance</option>
                  <option>Certificate of Indigency</option>
                  <option>Business Permit</option>
                  <option>Residency Certificate</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Purpose of Request</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="E.g. Job Application, Loan Requirement..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Supporting Documents (Optional)</label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG (Max 5MB)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setView('list')}>Cancel</Button>
              <Button className="px-8" onClick={() => setView('list')}>Submit Request</Button>
            </div>
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
                  {MOCK_REQUESTS.map((req) => (
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
                            <Button size="sm" variant="outline" className="h-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100">Approve</Button>
                            <Button size="sm" variant="outline" className="h-8 text-destructive border-red-200 bg-red-50 hover:bg-red-100">Decline</Button>
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