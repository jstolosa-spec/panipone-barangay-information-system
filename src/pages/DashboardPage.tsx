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
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
export function DashboardPage() {
  const currentUser = useAuthStore(s => s.currentUser);
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api<any>('/api/stats'),
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
  const COLORS = ['#2563eb', '#f59e0b', '#ef4444'];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
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
        <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
          Role: {currentUser.role}
        </div>
      </div>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', val: stats?.totalRequests ?? '-', icon: FileText, color: 'blue' },
          { label: 'Pending Docs', val: stats?.pendingRequests ?? '-', icon: Clock, color: 'amber' },
          { label: 'Approved', val: stats?.approvedRequests ?? '-', icon: CheckCircle2, color: 'green' },
          { label: 'Directory', val: stats?.totalPosts ?? '-', icon: BookUser, color: 'purple' },
        ].map((item, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="hover-card-blue h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-${item.color}-100`}>
                  <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-2xl font-bold">{item.val}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
          <Card className="h-full">
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                    <YAxis axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="requests" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Status Distribution & Quick Actions */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card>
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
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
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
                        <div className="h-2 w-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="bg-primary text-primary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                {isAdminOrStaff ? (
                  <>
                    <Button variant="secondary" className="w-full justify-start gap-2" asChild>
                      <Link to="/services"><Clock className="h-4 w-4" /> Review Pending</Link>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-2" asChild>
                      <Link to="/users"><UsersIcon className="h-4 w-4" /> Manage Residents</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" className="w-full justify-start gap-2" asChild>
                      <Link to="/services"><FilePlus className="h-4 w-4" /> Request Document</Link>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-2" asChild>
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