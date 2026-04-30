import React from 'react';
import {
  FileText, Clock, CheckCircle2, AlertCircle,
  TrendingUp, Users as UsersIcon, Bell, ArrowRight,
  ShieldCheck, FilePlus, BookUser
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api-client';
import type { DashboardStats } from '@shared/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
const COLOR_MAPS = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', primary: '#3b82f6' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', primary: '#f59e0b' },
  green: { bg: 'bg-green-100', text: 'text-green-600', primary: '#10b981' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', primary: '#8b5cf6' },
};
export function DashboardPage() {
  const currentUser = useAuthStore(s => s.currentUser);
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['stats'],
    queryFn: () => api<DashboardStats>('/api/stats'),
  });
  if (!currentUser) return null;
  const isAdminOrStaff = ['admin', 'captain', 'secretary'].includes(currentUser.role);
  const chartData = [
    { name: 'Jan', requests: 40 },
    { name: 'Feb', requests: 30 },
    { name: 'Mar', requests: 65 },
    { name: 'Apr', requests: 45 },
    { name: 'May', requests: stats?.totalRequests || 80 },
  ];
  const pieData = [
    { name: 'Approved', value: stats?.approvedRequests || 70 },
    { name: 'Pending', value: stats?.pendingRequests || 20 },
    { name: 'Rejected', value: stats?.rejectedRequests || 10 },
  ];
  const PIE_COLORS = [COLOR_MAPS.blue.primary, COLOR_MAPS.amber.primary, '#ef4444'];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  const statItems = [
    { label: 'Total Requests', val: stats?.totalRequests ?? '-', icon: FileText, color: 'blue' as const },
    { label: 'Pending Docs', val: stats?.pendingRequests ?? '-', icon: Clock, color: 'amber' as const },
    { label: 'Approved', val: stats?.approvedRequests ?? '-', icon: CheckCircle2, color: 'green' as const },
    { label: 'Directory', val: stats?.totalPosts ?? '-', icon: BookUser, color: 'purple' as const },
  ];
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {currentUser.name}</h1>
          <p className="text-muted-foreground">Overview for Barangay Panipuan Digital Portal.</p>
        </div>
        <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
          Role: {currentUser.role}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="hover-card-blue h-full border-none shadow-soft overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-4 relative">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${COLOR_MAPS[item.color].bg}`}>
                  <item.icon className={`h-6 w-6 ${COLOR_MAPS[item.color].text}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-2xl font-bold">{statsLoading ? '...' : item.val}</p>
                </div>
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                  <item.icon className="h-16 w-16" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full shadow-soft border-none">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Service Demand Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} fontSize={12} stroke="#94a3b8" />
                    <YAxis axisLine={false} tickLine={false} dx={-10} fontSize={12} stroke="#94a3b8" />
                    <Tooltip
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="requests" fill={COLOR_MAPS.blue.primary} radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card className="shadow-soft border-none">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Process Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{backgroundColor: PIE_COLORS[i]}} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-bold">{statsLoading ? '-' : item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="bg-primary text-primary-foreground overflow-hidden relative shadow-lg shadow-primary/20 border-none">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                {isAdminOrStaff ? (
                  <>
                    <Button variant="secondary" className="w-full justify-start gap-2 hover:bg-white" asChild>
                      <Link to="/services"><Clock className="h-4 w-4" /> Review Pending</Link>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-2 hover:bg-white" asChild>
                      <Link to="/users"><UsersIcon className="h-4 w-4" /> Manage Residents</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" className="w-full justify-start gap-2 hover:bg-white" asChild>
                      <Link to="/services"><FilePlus className="h-4 w-4" /> Request Document</Link>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-2 hover:bg-white" asChild>
                      <Link to="/directory"><BookUser className="h-4 w-4" /> Browse Directory</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}