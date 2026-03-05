import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, AlertTriangle, FileText, TrendingUp, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { SOSAlert, CrimeReport, DashboardStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [tab, setTab] = useState<'overview' | 'alerts' | 'reports'>('overview');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    api.getDashboardStats().then(setStats);
    api.getSOSAlerts().then(setAlerts);
    api.getCrimeReports().then(setReports);
  }, [isAuthenticated, user, navigate]);

  const handleReportAction = (id: string, action: CrimeReport['status']) => {
    setReports(prev => prev.map(r => r._id === id ? { ...r, status: action } : r));
    toast.success(`Report ${action}`);
  };

  const handleAlertAction = (id: string, status: SOSAlert['status']) => {
    setAlerts(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    toast.success(`Alert ${status}`);
  };

  if (!stats) return <div className="min-h-screen pt-[var(--nav-height)] flex items-center justify-center"><Clock className="h-8 w-8 animate-spin text-primary" /></div>;

  const statCards = [
    { label: 'Total Reports', value: stats.totalReports, icon: FileText, color: 'text-primary' },
    { label: 'Active Alerts', value: stats.activeAlerts, icon: AlertTriangle, color: 'text-emergency' },
    { label: 'Resolved Cases', value: stats.resolvedCases, icon: CheckCircle, color: 'text-success' },
    { label: 'Pending Review', value: stats.pendingReports, icon: Clock, color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen pt-[var(--nav-height)] py-10 px-4">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage city safety</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="text-3xl font-extrabold">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-secondary rounded-xl p-1 w-fit">
            {(['overview', 'alerts', 'reports'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Bar Chart - Reports by Type */}
              <div className="glass-card rounded-xl p-6 lg:col-span-2">
                <h3 className="font-bold mb-4">Reports by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.reportsByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
                    <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(220 70% 45%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Severity */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-bold mb-4">Severity Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={stats.severityDistribution} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={100} label>
                      {stats.severityDistribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart - Monthly Trend */}
              <div className="glass-card rounded-xl p-6 lg:col-span-3">
                <h3 className="font-bold mb-4">Monthly Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.reportsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(220 70% 45%)" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {tab === 'alerts' && (
            <div className="space-y-3">
              {alerts.map(a => (
                <div key={a._id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <div className={`p-2 rounded-full ${a.status === 'active' ? 'bg-emergency/10' : a.status === 'responding' ? 'bg-warning/10' : 'bg-success/10'}`}>
                    <AlertTriangle className={`h-5 w-5 ${a.status === 'active' ? 'text-emergency' : a.status === 'responding' ? 'text-warning' : 'text-success'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{a.userName}</p>
                    <p className="text-xs text-muted-foreground">{a.location.address} · {new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    a.status === 'active' ? 'bg-emergency/10 text-emergency' : a.status === 'responding' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>{a.status}</span>
                  {a.status === 'active' && (
                    <button onClick={() => handleAlertAction(a._id, 'responding')} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Respond</button>
                  )}
                  {a.status === 'responding' && (
                    <button onClick={() => handleAlertAction(a._id, 'resolved')} className="px-3 py-1.5 bg-success text-success-foreground rounded-lg text-xs font-medium">Resolve</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'reports' && (
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r._id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <div className={`p-2 rounded-full ${r.severity === 'high' ? 'bg-emergency/10' : r.severity === 'medium' ? 'bg-warning/10' : 'bg-success/10'}`}>
                    <FileText className={`h-5 w-5 ${r.severity === 'high' ? 'text-emergency' : r.severity === 'medium' ? 'text-warning' : 'text-success'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.userName} · {r.type} · {r.location.address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    r.status === 'approved' ? 'bg-success/10 text-success' :
                    r.status === 'rejected' ? 'bg-emergency/10 text-emergency' :
                    r.status === 'investigating' ? 'bg-primary/10 text-primary' :
                    'bg-warning/10 text-warning'
                  }`}>{r.status}</span>
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleReportAction(r._id, 'approved')} className="p-1.5 rounded-lg bg-success/10 hover:bg-success/20"><CheckCircle className="h-4 w-4 text-success" /></button>
                      <button onClick={() => handleReportAction(r._id, 'rejected')} className="p-1.5 rounded-lg bg-emergency/10 hover:bg-emergency/20"><XCircle className="h-4 w-4 text-emergency" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
