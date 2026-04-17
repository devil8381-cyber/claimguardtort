'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, LayoutDashboard, FileText, PlusCircle, MessageSquare,
  Settings, LogOut, ChevronRight, Clock, CheckCircle2,
  AlertCircle, Loader2, Eye, Save, User, Phone,
  Lock, Bell, Shield, Send, Inbox
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Claimant {
  id: string;
  trackingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  claimType: string | null;
  status: string;
  createdAt: string;
}

interface Claim {
  id: string;
  trackingId: string;
  status: string;
  claimType: string | null;
  description: string | null;
  filedDate: string;
  lastUpdated: string;
  notes?: string | null;
  nextSteps?: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-900/30 text-amber-400 border-amber-700/30',
  'Under Review': 'bg-blue-900/30 text-blue-400 border-blue-700/30',
  Approved: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
  Denied: 'bg-red-900/30 text-red-400 border-red-700/30',
  'Correction Needed': 'bg-purple-900/30 text-purple-400 border-purple-700/30',
  Submitted: 'bg-slate-700 text-slate-300 border-slate-600',
  Validated: 'bg-cyan-900/30 text-cyan-400 border-cyan-700/30',
  Decision: 'bg-orange-900/30 text-orange-400 border-orange-700/30',
  Completed: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
  Active: 'bg-blue-900/30 text-blue-400 border-blue-700/30',
  Settled: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
};

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  Pending: Clock,
  'Under Review': Eye,
  Approved: CheckCircle2,
  Denied: AlertCircle,
  'Correction Needed': AlertCircle,
  Submitted: Clock,
  Completed: CheckCircle2,
};

const caseTypes = [
  'Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat',
  'Firefighting Foam (AFFF)', 'Zantac', 'Hair Relaxer', 'CPAP Machines',
  'Social Media', 'Rideshare Assault', 'NEC Baby Formula', 'Depo Provera',
  'Roblox / Gaming', 'IL Detention', '3M Earplugs', 'Exactech Implants',
  'Bard PowerPort', 'Elmiron', 'Taxotere',
];

type Tab = 'dashboard' | 'claims' | 'new-claim' | 'messages' | 'settings';

export default function MemberPortal() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<Claimant | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // New claim form
  const [newClaim, setNewClaim] = useState({ claimType: '', description: '' });
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState('');

  // Settings form
  const [settingsForm, setSettingsForm] = useState({ firstName: '', lastName: '', phone: '', currentPassword: '', newPassword: '' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState('');

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('cg_token');
    const userData = localStorage.getItem('cg_user');
    if (!token || !userData) return;

    try {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setSettingsForm({
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        phone: parsed.phone || '',
        currentPassword: '',
        newPassword: '',
      });

      const res = await fetch(`/api/claims?claimantId=${parsed.id}`);
      if (res.ok) {
        const data = await res.json();
        setClaims(Array.isArray(data) ? data : data.claims || []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('cg_token');
    if (!token) return;

    const handleOpen = () => {
      setActiveTab('dashboard');
      fetchUser();
      setOpen(true);
    };

    window.addEventListener('open-portal', handleOpen);
    window.addEventListener('auth-change', handleOpen);
    return () => {
      window.removeEventListener('open-portal', handleOpen);
      window.removeEventListener('auth-change', handleOpen);
    };
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem('cg_token');
    localStorage.removeItem('cg_user');
    setUser(null);
    setClaims([]);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('auth-change'));
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newClaim.claimType || !newClaim.description) return;
    setSubmittingClaim(true);
    setClaimError('');
    try {
      const trackingId = `CLM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId,
          claimType: newClaim.claimType,
          description: newClaim.description,
          claimantId: user.id,
          status: 'Pending',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setClaimSuccess(true);
        setNewClaim({ claimType: '', description: '' });
        fetchUser();
        setTimeout(() => setClaimSuccess(false), 4000);
      } else {
        setClaimError(data.error || 'Failed to submit claim');
      }
    } catch {
      setClaimError('Something went wrong. Please try again.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSavingSettings(true);
    setSettingsMsg('');
    try {
      const res = await fetch(`/api/claimants`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          firstName: settingsForm.firstName,
          lastName: settingsForm.lastName,
          phone: settingsForm.phone,
          password: settingsForm.currentPassword || undefined,
        }),
      });
      if (res.ok) {
        setSettingsMsg('Profile updated successfully!');
        fetchUser();
      } else {
        const data = await res.json();
        setSettingsMsg(data.error || 'Failed to update');
      }
    } catch {
      setSettingsMsg('Something went wrong');
    } finally {
      setSavingSettings(false);
    }
  };

  if (!user) return null;

  const pendingCount = claims.filter((c) => c.status === 'Pending' || c.status === 'Under Review' || c.status === 'Correction Needed').length;
  const approvedCount = claims.filter((c) => c.status === 'Approved' || c.status === 'Completed' || c.status === 'Settled').length;

  const tabs = [
    { value: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { value: 'claims' as Tab, label: 'My Claims', icon: FileText },
    { value: 'new-claim' as Tab, label: 'New Claim', icon: PlusCircle },
    { value: 'messages' as Tab, label: 'Messages', icon: MessageSquare },
    { value: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-slate-950 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-700/50 bg-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm md:text-base">
                  Member Portal
                </h2>
                <p className="text-xs text-slate-400">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-700/50 bg-amber-500/5 hidden sm:inline-flex">
                ID: {user.trackingId}
              </Badge>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Close portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="shrink-0 border-b border-slate-700/50 bg-slate-900/80 overflow-x-auto">
            <div className="flex px-2 md:px-4 gap-1 p-1.5 min-w-max md:min-w-0">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setActiveTab(t.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                    {t.value === 'claims' && pendingCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                        {pendingCount}
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
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    Welcome back, {user.firstName}!
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Here&apos;s an overview of your claims.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white">{claims.length}</div>
                      <div className="text-xs text-slate-400 mt-1">Total Claims</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-amber-400">{pendingCount}</div>
                      <div className="text-xs text-slate-400 mt-1">Active</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-emerald-400">{approvedCount}</div>
                      <div className="text-xs text-slate-400 mt-1">Approved</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4 text-center">
                      <div className="text-lg md:text-xl font-bold text-blue-400">{user.trackingId}</div>
                      <div className="text-xs text-slate-400 mt-1">Client ID</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Claims */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-white">Recent Claims</CardTitle>
                      {claims.length > 0 && (
                        <button
                          onClick={() => setActiveTab('claims')}
                          className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                        >
                          View All
                        </button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {claims.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">No claims yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          onClick={() => setActiveTab('new-claim')}
                        >
                          Submit Your First Claim
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {claims.slice(0, 5).map((claim) => {
                          const StatusIcon = STATUS_ICON[claim.status] || Clock;
                          return (
                            <div
                              key={claim.id}
                              className="flex items-center justify-between py-3 px-3 rounded-lg bg-slate-700/30 border border-slate-700/30"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">
                                  {claim.claimType || 'Unknown'}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">{claim.trackingId}</p>
                              </div>
                              <Badge variant="outline" className={`text-[10px] shrink-0 ml-3 border ${STATUS_COLORS[claim.status] || ''}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {claim.status}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab('new-claim')}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all group"
                  >
                    <PlusCircle className="w-6 h-6 text-amber-400" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">Submit New Claim</p>
                      <p className="text-xs text-slate-400">File a new mass tort claim</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 ml-auto group-hover:text-amber-400 transition-colors" />
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all group"
                  >
                    <MessageSquare className="w-6 h-6 text-slate-400" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">Messages</p>
                      <p className="text-xs text-slate-400">View updates & notifications</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 ml-auto group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            )}

            {/* My Claims */}
            {activeTab === 'claims' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <h3 className="text-xl font-bold text-white">My Claims</h3>
                {claims.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">You haven&apos;t filed any claims yet.</p>
                    <Button onClick={() => setActiveTab('new-claim')} className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Submit a Claim
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {claims.map((claim) => {
                      const StatusIcon = STATUS_ICON[claim.status] || Clock;
                      return (
                        <Card key={claim.id} className="bg-slate-800/50 border-slate-700/50">
                          <CardContent className="p-4 md:p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-white">
                                  {claim.claimType || 'Unknown Case Type'}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5 font-mono">{claim.trackingId}</p>
                                {claim.description && (
                                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                                    {claim.description}
                                  </p>
                                )}
                                {claim.notes && (
                                  <div className="mt-2 p-2 rounded-lg bg-slate-700/30 text-xs text-slate-300">
                                    <span className="text-slate-500">Notes: </span>{claim.notes}
                                  </div>
                                )}
                                {claim.nextSteps && (
                                  <div className="mt-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300">
                                    <span className="text-amber-500/70">Next Steps: </span>{claim.nextSteps}
                                  </div>
                                )}
                              </div>
                              <Badge variant="outline" className={`text-[10px] shrink-0 border ${STATUS_COLORS[claim.status] || ''}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {claim.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Filed: {new Date(claim.filedDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                Updated: {new Date(claim.lastUpdated).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* New Claim */}
            {activeTab === 'new-claim' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-xl font-bold text-white">Submit New Claim</h3>

                {claimSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-8 text-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-white">Claim Submitted!</h4>
                    <p className="text-sm text-slate-400 mt-2">
                      Your claim has been received. We&apos;ll review it within 24-48 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitClaim} className="space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-slate-300">Case Type *</Label>
                          <select
                            value={newClaim.claimType}
                            onChange={(e) => setNewClaim({ ...newClaim, claimType: e.target.value })}
                            className="w-full h-12 rounded-lg border border-slate-600 bg-slate-700 px-3 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                            required
                          >
                            <option value="">Select case type...</option>
                            {caseTypes.map((ct) => (
                              <option key={ct} value={ct}>{ct}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm text-slate-300">Description *</Label>
                          <Textarea
                            value={newClaim.description}
                            onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
                            placeholder="Describe your situation, injuries, and how the product or exposure affected you..."
                            className="min-h-[150px] bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            required
                          />
                        </div>

                        {claimError && (
                          <p className="text-sm text-red-400">{claimError}</p>
                        )}

                        <Button
                          type="submit"
                          disabled={submittingClaim}
                          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold h-12"
                        >
                          {submittingClaim ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Submit Claim
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </form>
                )}
              </div>
            )}

            {/* Messages */}
            {activeTab === 'messages' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <h3 className="text-xl font-bold text-white">Messages</h3>
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 mb-2">No messages yet.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Claim updates and notifications will appear here. You&apos;ll receive an email whenever your claim status changes.
                  </p>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-xl font-bold text-white">Settings</h3>
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-5 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-400">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">First Name</Label>
                        <Input
                          value={settingsForm.firstName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, firstName: e.target.value })}
                          className="h-11 bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">Last Name</Label>
                        <Input
                          value={settingsForm.lastName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, lastName: e.target.value })}
                          className="h-11 bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Phone</Label>
                      <Input
                        type="tel"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="h-11 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Email (cannot change)</Label>
                      <Input value={user.email} className="h-11 bg-slate-700/50 border-slate-700 text-slate-400" disabled />
                    </div>

                    <div className="border-t border-slate-700/50 pt-5">
                      <h4 className="text-sm font-medium text-white mb-3">Change Password</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-400">Current Password</Label>
                          <Input
                            type="password"
                            value={settingsForm.currentPassword}
                            onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
                            className="h-11 bg-slate-700 border-slate-600 text-white"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-400">New Password</Label>
                          <Input
                            type="password"
                            value={settingsForm.newPassword}
                            onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                            className="h-11 bg-slate-700 border-slate-600 text-white"
                            placeholder="Min. 6 characters"
                          />
                        </div>
                      </div>
                    </div>

                    {settingsMsg && (
                      <p className={`text-sm ${settingsMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {settingsMsg}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold"
                      >
                        {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                          <><Save className="w-4 h-4 mr-1.5" /> Save Changes</>
                        )}
                      </Button>
                      <Button variant="outline" onClick={logout} className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                        <LogOut className="w-4 h-4 mr-1.5" /> Log Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
