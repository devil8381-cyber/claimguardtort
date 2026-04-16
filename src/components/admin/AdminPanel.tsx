'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, LayoutDashboard, Users, PlusCircle, Upload, Settings,
  Loader2, Search, Download, Eye, Trash2, FileText, Mail,
  BarChart3, Shield, ExternalLink, Copy, CheckCircle2, XCircle,
  Clock, MessageSquare, AlertTriangle, ChevronDown, RefreshCw,
  Edit, Save, Ban, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type AdminTab = 'dashboard' | 'claimants' | 'create-claim' | 'messages' | 'settings';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-900/30 text-amber-400 border-amber-700/30',
  'Under Review': 'bg-blue-900/30 text-blue-400 border-blue-700/30',
  Approved: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
  Denied: 'bg-red-900/30 text-red-400 border-red-700/30',
  'Correction Needed': 'bg-purple-900/30 text-purple-400 border-purple-700/30',
  Submitted: 'bg-slate-700 text-slate-300 border-slate-600',
  Active: 'bg-blue-900/30 text-blue-400 border-blue-700/30',
  Settled: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
};

const caseTypes = [
  'Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat',
  'Firefighting Foam (AFFF)', 'Zantac', 'Hair Relaxer', 'CPAP Machines',
  'Social Media', 'Rideshare Assault', 'NEC Baby Formula', 'Depo Provera',
  'Roblox / Gaming', 'IL Detention', '3M Earplugs', 'Exactech Implants',
  'Bard PowerPort', 'Elmiron', 'Taxotere',
];

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [claimants, setClaimants] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Create claim form
  const [createForm, setCreateForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', trackingId: '',
    claimType: '', status: 'Pending', description: '', notes: ''
  });
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<{ success: boolean; message: string } | null>(null);

  // Edit claim
  const [editClaimId, setEditClaimId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editNextSteps, setEditNextSteps] = useState('');
  const [saving, setSaving] = useState(false);

  // Settings
  const [settingsData, setSettingsData] = useState<any>(null);

  // Load password from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cg_admin_token');
    if (saved) {
      setPassword(saved);
      // Auto-authenticate
      handleAuthWithToken(saved);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
    };
    window.addEventListener('open-admin', handleOpen);
    return () => window.removeEventListener('open-admin', handleOpen);
  }, []);

  const handleAuthWithToken = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'x-admin-token': token },
      });
      if (res.ok) {
        setAuthenticated(true);
        localStorage.setItem('cg_admin_token', token);
        loadAllData(token);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
        localStorage.setItem('cg_admin_token', password);
        loadAllData(password);
      } else {
        setAuthError('Invalid admin password.');
      }
    } catch {
      setAuthError('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = (token: string) => {
    loadDashboard(token);
    loadClaimants(token);
    loadMessages(token);
    loadClaims(token);
    loadSettings(token);
  };

  const loadDashboard = async (token?: string) => {
    const t = token || password;
    try {
      const res = await fetch('/api/admin/dashboard', { headers: { 'x-admin-token': t } });
      if (res.ok) setDashboardStats(await res.json());
    } catch { /* ignore */ }
  };

  const loadClaimants = async (token?: string) => {
    const t = token || password;
    try {
      const res = await fetch('/api/admin/claimants', { headers: { 'x-admin-token': t } });
      if (res.ok) {
        const data = await res.json();
        setClaimants(Array.isArray(data) ? data : data.claimants || []);
      }
    } catch { /* ignore */ }
  };

  const loadMessages = async (token?: string) => {
    const t = token || password;
    try {
      const res = await fetch('/api/admin/messages', { headers: { 'x-admin-token': t } });
      if (res.ok) setMessages(Array.isArray(await res.json()) ? await res.clone().json() : []);
    } catch { /* ignore */ }
  };

  const loadClaims = async (token?: string) => {
    const t = token || password;
    try {
      const res = await fetch('/api/admin/claims', { headers: { 'x-admin-token': t } });
      if (res.ok) setClaims(await res.json());
    } catch { /* ignore */ }
  };

  const loadSettings = async (token?: string) => {
    const t = token || password;
    try {
      const res = await fetch('/api/admin/settings', { headers: { 'x-admin-token': t } });
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

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateResult(null);
    try {
      const res = await fetch('/api/admin/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': password },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (res.ok) {
        setCreateResult({ success: true, message: `Claim ${createForm.trackingId} created successfully!` });
        setCreateForm({ firstName: '', lastName: '', email: '', phone: '', trackingId: '', claimType: '', status: 'Pending', description: '', notes: '' });
        loadClaims();
        loadClaimants();
        loadDashboard();
      } else {
        setCreateResult({ success: false, message: data.error || 'Failed to create claim' });
      }
    } catch {
      setCreateResult({ success: false, message: 'Network error' });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateClaim = async () => {
    if (!editClaimId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/claims/${editClaimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': password },
        body: JSON.stringify({ status: editStatus, notes: editNotes, nextSteps: editNextSteps }),
      });
      if (res.ok) {
        setEditClaimId(null);
        loadClaims();
        loadDashboard();
      }
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const closePanel = () => {
    setOpen(false);
    setSidebarOpen(false);
  };

  const filteredClaimants = claimants.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.trackingId} ${c.claimType || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter((m) =>
    `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { value: 'dashboard' as AdminTab, label: 'Dashboard', icon: BarChart3 },
    { value: 'claimants' as AdminTab, label: 'Claimants', icon: Users },
    { value: 'create-claim' as AdminTab, label: 'Create Claim', icon: PlusCircle },
    { value: 'messages' as AdminTab, label: 'Messages', icon: MessageSquare },
    { value: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-slate-950 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-700/50 bg-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 lg:hidden"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h2 className="font-semibold text-white">Admin Panel</h2>
              </div>
            </div>
            <button
              onClick={closePanel}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!authenticated ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-sm text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mx-auto shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Admin Access</h3>
                  <p className="text-sm text-slate-400 mt-1">Enter the admin password to continue.</p>
                </div>
                <form onSubmit={handleAuth} className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-slate-800 border-slate-700 text-white"
                  />
                  {authError && <p className="text-xs text-red-400">{authError}</p>}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate'}
                  </Button>
                </form>
                <p className="text-[10px] text-slate-600">
                  Access via: Add &quot;/admin&quot; to the website URL, or type &quot;admin&quot; 3 times on the homepage
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className={`shrink-0 border-b border-slate-700/50 bg-slate-900/80 overflow-x-auto ${sidebarOpen ? '' : 'hidden lg:block'}`}>
                <div className="flex px-2 md:px-4 gap-1 p-1.5 min-w-max md:min-w-0">
                  {tabs.map((t) => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.value;
                    const count = t.value === 'messages' ? messages.filter(m => !m.read).length : 0;
                    return (
                      <button
                        key={t.value}
                        onClick={() => { setActiveTab(t.value); setSidebarOpen(false); }}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                        {count > 0 && (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                  <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Dashboard</h3>
                      <Button variant="outline" size="sm" onClick={() => loadAllData()} className="border-slate-700 text-slate-400">
                        <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
                      </Button>
                    </div>
                    {dashboardStats ? (
                      <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                          <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl md:text-3xl font-bold text-white">{dashboardStats.claims?.total || 0}</div>
                              <div className="text-xs text-slate-400 mt-1">Total Claims</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl md:text-3xl font-bold text-amber-400">{dashboardStats.claims?.byStatus?.Pending || 0}</div>
                              <div className="text-xs text-slate-400 mt-1">Pending</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl md:text-3xl font-bold text-blue-400">{dashboardStats.claims?.byStatus?.['Under Review'] || 0}</div>
                              <div className="text-xs text-slate-400 mt-1">Under Review</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl md:text-3xl font-bold text-emerald-400">{dashboardStats.claims?.byStatus?.Approved || 0}</div>
                              <div className="text-xs text-slate-400 mt-1">Approved</div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                          <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl md:text-3xl font-bold text-white">{dashboardStats.claimants?.total || 0}</div>
                              <div className="text-xs text-slate-400 mt-1">Claimants</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl md:text-3xl font-bold text-white">{dashboardStats.messages?.total || 0}</div>
                              <div className="text-xs text-slate-400 mt-1">Messages</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl md:text-3xl font-bold text-red-400">{dashboardStats.messages?.unread || 0}</div>
                              <div className="text-xs text-slate-400 mt-1">Unread Messages</div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Recent Claims */}
                        <Card className="bg-slate-800/50 border-slate-700/50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white">Recent Claims</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {claims.slice(0, 10).map((claim) => (
                                <div key={claim.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-700/30">
                                  <div className="min-w-0">
                                    <p className="text-sm text-white truncate">{claim.claimant?.firstName} {claim.claimant?.lastName} — {claim.claimType || 'N/A'}</p>
                                    <p className="text-xs text-slate-500 font-mono">{claim.trackingId}</p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 ml-2">
                                    <Badge variant="outline" className={`text-[10px] border ${STATUS_COLORS[claim.status] || ''}`}>
                                      {claim.status}
                                    </Badge>
                                    <button
                                      onClick={() => {
                                        setEditClaimId(claim.id);
                                        setEditStatus(claim.status);
                                        setEditNotes(claim.notes || '');
                                        setEditNextSteps(claim.nextSteps || '');
                                      }}
                                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-600 text-slate-400"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {claims.length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-4">No claims yet.</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                      </div>
                    )}
                  </div>
                )}

                {/* Claimants */}
                {activeTab === 'claimants' && (
                  <div className="max-w-5xl mx-auto space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">Claimants</h3>
                      <Button variant="outline" size="sm" onClick={loadClaimants} className="border-slate-700 text-slate-400">
                        <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
                      </Button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input placeholder="Search claimants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Tracking ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {filteredClaimants.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-800/50">
                              <td className="px-4 py-3 font-medium text-white">{c.firstName} {c.lastName}</td>
                              <td className="px-4 py-3 font-mono text-xs text-amber-400">{c.trackingId}</td>
                              <td className="px-4 py-3 text-xs text-slate-400">{c.email}</td>
                              <td className="px-4 py-3"><Badge variant="outline" className={`text-[10px] border ${STATUS_COLORS[c.status] || ''}`}>{c.status}</Badge></td>
                              <td className="px-4 py-3 text-xs text-slate-400">{c.claimType || '—'}</td>
                              <td className="px-4 py-3 text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                          {filteredClaimants.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">No claimants found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Create Claim */}
                {activeTab === 'create-claim' && (
                  <div className="max-w-2xl mx-auto space-y-4">
                    <h3 className="text-xl font-bold text-white">Create New Claim</h3>
                    <form onSubmit={handleCreateClaim}>
                      <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-5 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-slate-400">First Name *</Label>
                              <Input value={createForm.firstName} onChange={(e) => setCreateForm({...createForm, firstName: e.target.value})} className="h-11 bg-slate-700 border-slate-600 text-white" required />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-slate-400">Last Name *</Label>
                              <Input value={createForm.lastName} onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})} className="h-11 bg-slate-700 border-slate-600 text-white" required />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Email *</Label>
                            <Input type="email" value={createForm.email} onChange={(e) => setCreateForm({...createForm, email: e.target.value})} className="h-11 bg-slate-700 border-slate-600 text-white" required />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Phone</Label>
                            <Input value={createForm.phone} onChange={(e) => setCreateForm({...createForm, phone: e.target.value})} className="h-11 bg-slate-700 border-slate-600 text-white" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Claim Tracking ID *</Label>
                            <Input placeholder="CLM-2025-0001" value={createForm.trackingId} onChange={(e) => setCreateForm({...createForm, trackingId: e.target.value})} className="h-11 bg-slate-700 border-slate-600 text-white font-mono" required />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-slate-400">Case Type</Label>
                              <select value={createForm.claimType} onChange={(e) => setCreateForm({...createForm, claimType: e.target.value})} className="w-full h-11 rounded-lg border border-slate-600 bg-slate-700 px-3 text-sm text-white outline-none">
                                <option value="">Select...</option>
                                {caseTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-slate-400">Status</Label>
                              <select value={createForm.status} onChange={(e) => setCreateForm({...createForm, status: e.target.value})} className="w-full h-11 rounded-lg border border-slate-600 bg-slate-700 px-3 text-sm text-white outline-none">
                                <option>Pending</option>
                                <option>Under Review</option>
                                <option>Approved</option>
                                <option>Denied</option>
                                <option>Correction Needed</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Description</Label>
                            <Textarea value={createForm.description} onChange={(e) => setCreateForm({...createForm, description: e.target.value})} className="bg-slate-700 border-slate-600 text-white min-h-[80px]" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Notes</Label>
                            <Textarea value={createForm.notes} onChange={(e) => setCreateForm({...createForm, notes: e.target.value})} className="bg-slate-700 border-slate-600 text-white min-h-[60px]" />
                          </div>

                          {createResult && (
                            <div className={`p-3 rounded-lg text-sm ${createResult.success ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-700/30' : 'bg-red-900/20 text-red-400 border border-red-700/30'}`}>
                              {createResult.message}
                            </div>
                          )}

                          <Button type="submit" disabled={creating} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold h-12">
                            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4 mr-2" /> Create Claim</>}
                          </Button>
                        </CardContent>
                      </Card>
                    </form>
                  </div>
                )}

                {/* Messages */}
                {activeTab === 'messages' && (
                  <div className="max-w-5xl mx-auto space-y-4">
                    <h3 className="text-xl font-bold text-white">Messages</h3>
                    <div className="space-y-3">
                      {filteredMessages.map((m: any) => (
                        <Card key={m.id} className={`border ${!m.read ? 'border-blue-700/30 bg-blue-900/5' : 'border-slate-700/50 bg-slate-800/50'}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-white">{m.name}</span>
                                  {!m.read && <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">New</Badge>}
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{m.email} {m.phone ? `| ${m.phone}` : ''}</p>
                                <p className="text-sm text-slate-300 line-clamp-3">{m.message}</p>
                                <p className="text-[10px] text-slate-600 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
                              </div>
                              {!m.read && (
                                <Button size="sm" variant="ghost" className="shrink-0 text-xs text-slate-400 hover:text-white" onClick={() => markMessageRead(m.id, true)}>
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Read
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {filteredMessages.length === 0 && (
                        <div className="text-center py-16">
                          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                          <p className="text-sm text-slate-500">No messages yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Settings */}
                {activeTab === 'settings' && (
                  <div className="max-w-3xl mx-auto space-y-4">
                    <h3 className="text-xl font-bold text-white">Settings</h3>
                    {settingsData ? (
                      <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-sm text-white mb-3">System Configuration</h4>
                          <pre className="text-xs text-slate-400 bg-slate-900 p-4 rounded-lg overflow-x-auto">{JSON.stringify(settingsData, null, 2)}</pre>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Edit Claim Modal */}
              <AnimatePresence>
                {editClaimId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setEditClaimId(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">Update Claim</h4>
                        <button onClick={() => setEditClaimId(null)} className="text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">Status</Label>
                        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full h-11 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-white outline-none">
                          <option>Pending</option>
                          <option>Under Review</option>
                          <option>Approved</option>
                          <option>Denied</option>
                          <option>Correction Needed</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">Notes</Label>
                        <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="bg-slate-800 border-slate-600 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">Next Steps</Label>
                        <Textarea value={editNextSteps} onChange={(e) => setEditNextSteps(e.target.value)} className="bg-slate-800 border-slate-600 text-white" />
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleUpdateClaim} disabled={saving} className="bg-amber-500 text-slate-900 font-semibold">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> Save</>}
                        </Button>
                        <Button variant="outline" onClick={() => setEditClaimId(null)} className="border-slate-700 text-slate-400">Cancel</Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
