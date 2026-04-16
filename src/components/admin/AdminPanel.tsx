'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, LayoutDashboard, Users, PlusCircle, Upload, Image, Settings,
  Loader2, Search, Download, Eye, Trash2, FileText, Mail,
  BarChart3, Shield, ExternalLink, Copy, CheckCircle2, XCircle,
  Clock, MessageSquare, AlertTriangle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AdminTab = 'dashboard' | 'claimants' | 'messages' | 'settings';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  'Under Review': 'bg-blue-100 text-blue-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Denied: 'bg-red-100 text-red-700',
  'Correction Needed': 'bg-purple-100 text-purple-700',
  Submitted: 'bg-slate-100 text-slate-700',
  Active: 'bg-blue-100 text-blue-700',
  Settled: 'bg-emerald-100 text-emerald-700',
};

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Data
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [claimants, setClaimants] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Settings
  const [settingsData, setSettingsData] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
    };
    window.addEventListener('open-admin', handleOpen);
    return () => window.removeEventListener('open-admin', handleOpen);
  }, []);

  const handleAuth = async () => {
    setAuthError('');
    if (!password) {
      setAuthError('Password is required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'x-admin-token': password },
      });
      if (res.ok) {
        setAuthenticated(true);
        loadDashboard();
        loadClaimants();
        loadMessages();
        loadSettings();
      } else {
        setAuthError('Invalid admin password.');
      }
    } catch {
      setAuthError('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'x-admin-token': password },
      });
      if (res.ok) setDashboardStats(await res.json());
    } catch { /* ignore */ }
  };

  const loadClaimants = async () => {
    try {
      const res = await fetch('/api/admin/claimants', {
        headers: { 'x-admin-token': password },
      });
      if (res.ok) {
        const data = await res.json();
        setClaimants(Array.isArray(data) ? data : data.claimants || []);
      }
    } catch { /* ignore */ }
  };

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { 'x-admin-token': password },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch { /* ignore */ }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { 'x-admin-token': password },
      });
      if (res.ok) setSettingsData(await res.json());
    } catch { /* ignore */ }
  };

  const markMessageRead = async (id: string, read: boolean) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': password },
        body: JSON.stringify({ read }),
      });
      loadMessages();
    } catch { /* ignore */ }
  };

  const filteredClaimants = claimants.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.trackingId} ${c.claimType || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[95vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Admin Panel</h2>
              </div>
              <button
                onClick={() => { setOpen(false); setAuthenticated(false); setPassword(''); }}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!authenticated ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm text-center space-y-4">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Access</h3>
                  <p className="text-sm text-slate-500">Enter the admin password to continue.</p>
                  <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                    />
                    {authError && <p className="text-xs text-red-500">{authError}</p>}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-blue-600 text-white"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate'}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)} className="h-full flex flex-col">
                  <div className="shrink-0 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-x-auto">
                    <TabsList className="inline-flex w-max mx-auto gap-0.5 p-1 bg-transparent h-auto">
                      {[
                        { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                        { value: 'claimants', label: 'Claimants', icon: Users },
                        { value: 'messages', label: 'Messages', icon: MessageSquare },
                        { value: 'settings', label: 'Settings', icon: Settings },
                      ].map((t) => {
                        const Icon = t.icon;
                        return (
                          <TabsTrigger key={t.value} value={t.value} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 whitespace-nowrap">
                            <Icon className="w-3.5 h-3.5" />
                            {t.label}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {/* Dashboard */}
                    <TabsContent value="dashboard" className="m-0 p-4 md:p-6">
                      {dashboardStats ? (
                        <div className="space-y-5">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{dashboardStats.claims?.total || 0}</div><div className="text-xs text-slate-500">Total Claims</div></CardContent></Card>
                            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-amber-600">{dashboardStats.claims?.byStatus?.Pending || 0}</div><div className="text-xs text-slate-500">Pending</div></CardContent></Card>
                            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{dashboardStats.claims?.byStatus?.['Under Review'] || 0}</div><div className="text-xs text-slate-500">Under Review</div></CardContent></Card>
                            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-emerald-600">{dashboardStats.claims?.byStatus?.Approved || 0}</div><div className="text-xs text-slate-500">Approved</div></CardContent></Card>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{dashboardStats.claimants?.total || 0}</div><div className="text-xs text-slate-500">Claimants</div></CardContent></Card>
                            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{dashboardStats.messages?.total || 0}</div><div className="text-xs text-slate-500">Messages</div></CardContent></Card>
                            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{dashboardStats.messages?.unread || 0}</div><div className="text-xs text-slate-500">Unread</div></CardContent></Card>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                      )}
                    </TabsContent>

                    {/* Claimants */}
                    <TabsContent value="claimants" className="m-0 p-4 md:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input placeholder="Search claimants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-10" />
                        </div>
                        <Button variant="outline" size="sm" onClick={loadClaimants}>
                          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
                        </Button>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Tracking ID</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Status</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredClaimants.map((c) => (
                              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{c.firstName} {c.lastName}</td>
                                <td className="px-3 py-2 font-mono text-xs">{c.trackingId}</td>
                                <td className="px-3 py-2"><Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[c.status] || ''}`}>{c.status}</Badge></td>
                                <td className="px-3 py-2 text-xs">{c.claimType || '—'}</td>
                                <td className="px-3 py-2 text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                            {filteredClaimants.length === 0 && (
                              <tr><td colSpan={5} className="px-3 py-6 text-center text-sm text-slate-500">No claimants found.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    {/* Messages */}
                    <TabsContent value="messages" className="m-0 p-4 md:p-6">
                      <div className="space-y-3">
                        {messages.map((m: any) => (
                          <Card key={m.id} className={`border ${!m.read ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-slate-700'}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{m.name}</span>
                                    {!m.read && <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">New</Badge>}
                                  </div>
                                  <p className="text-xs text-slate-500 mb-1">{m.email} {m.phone ? `· ${m.phone}` : ''}</p>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{m.message}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">{new Date(m.createdAt).toLocaleString()}</p>
                                </div>
                                {!m.read && (
                                  <Button size="sm" variant="ghost" className="shrink-0 text-xs" onClick={() => markMessageRead(m.id, true)}>
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Read
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {messages.length === 0 && (
                          <div className="text-center py-12">
                            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No messages yet.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Settings */}
                    <TabsContent value="settings" className="m-0 p-4 md:p-6">
                      {settingsData ? (
                        <div className="space-y-4">
                          <Card><CardContent className="p-4"><h4 className="font-semibold text-sm mb-2">Company Settings</h4><pre className="text-xs text-slate-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 p-3 rounded-lg overflow-x-auto">{JSON.stringify(settingsData, null, 2)}</pre></CardContent></Card>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RefreshCw(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}
