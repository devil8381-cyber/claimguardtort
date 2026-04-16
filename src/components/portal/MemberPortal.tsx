'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, LayoutDashboard, FileText, PlusCircle, MessageSquare,
  Settings, LogOut, ChevronRight, Clock, CheckCircle2,
  AlertCircle, Loader2, Eye, Upload, Save, User, Phone,
  Lock, Bell, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
}

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Under Review': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Denied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Correction Needed': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Submitted: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  Validated: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Decision: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Settled: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export default function MemberPortal() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<Claimant | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // New claim form
  const [newClaim, setNewClaim] = useState({ claimType: '', description: '' });
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

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

      // Fetch claims
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
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newClaim.claimType || !newClaim.description) return;
    setSubmittingClaim(true);
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
      if (res.ok) {
        setClaimSuccess(true);
        setNewClaim({ claimType: '', description: '' });
        fetchUser();
        setTimeout(() => setClaimSuccess(false), 4000);
      }
    } catch {
      // ignore
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

  const caseTypes = [
    'Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat',
    'Firefighting Foam (AFFF)', 'Zantac', 'Hair Relaxer', 'CPAP Machines',
    'Social Media', 'Rideshare Assault', 'NEC Baby Formula', 'Depo Provera',
    'Roblox / Gaming', 'IL Detention', '3M Earplugs', 'Exactech Implants',
    'Bard PowerPort', 'Elmiron', 'Taxotere',
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-slate-900 w-full sm:max-w-4xl h-[92vh] sm:h-[85vh] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                    Member Portal
                  </h2>
                  <p className="text-xs text-slate-500">
                    {user.firstName} {user.lastName} &middot; {user.trackingId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close portal"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                {/* Tab list - horizontal scroll on mobile */}
                <div className="shrink-0 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-x-auto">
                  <TabsList className="inline-flex w-max mx-auto gap-0.5 p-1 bg-transparent h-auto">
                    {[
                      { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                      { value: 'claims', label: 'My Claims', icon: FileText },
                      { value: 'new-claim', label: 'New Claim', icon: PlusCircle },
                      { value: 'messages', label: 'Messages', icon: MessageSquare },
                      { value: 'settings', label: 'Settings', icon: Settings },
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <TabsTrigger
                          key={t.value}
                          value={t.value}
                          className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-lg data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 whitespace-nowrap"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Dashboard */}
                  <TabsContent value="dashboard" className="m-0 p-4 md:p-6 space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Welcome back, {user.firstName}!
                      </h3>
                      <p className="text-sm text-slate-500">Here&apos;s an overview of your claims.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <Card className="border-gray-200 dark:border-slate-700">
                        <CardContent className="p-3 md:p-4 text-center">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{claims.length}</div>
                          <div className="text-xs text-slate-500">Total Claims</div>
                        </CardContent>
                      </Card>
                      <Card className="border-gray-200 dark:border-slate-700">
                        <CardContent className="p-3 md:p-4 text-center">
                          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
                          <div className="text-xs text-slate-500">Active</div>
                        </CardContent>
                      </Card>
                      <Card className="border-gray-200 dark:border-slate-700">
                        <CardContent className="p-3 md:p-4 text-center">
                          <div className="text-2xl font-bold text-emerald-600">{approvedCount}</div>
                          <div className="text-xs text-slate-500">Approved</div>
                        </CardContent>
                      </Card>
                      <Card className="border-gray-200 dark:border-slate-700">
                        <CardContent className="p-3 md:p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">{user.trackingId.slice(-4)}</div>
                          <div className="text-xs text-slate-500">Client ID</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Claims */}
                    <Card className="border-gray-200 dark:border-slate-700">
                      <CardHeader className="pb-2 pt-4 px-4 md:px-6">
                        <CardTitle className="text-sm font-semibold">Recent Claims</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 md:px-6 pb-4">
                        {claims.length === 0 ? (
                          <div className="text-center py-6">
                            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No claims yet</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => setActiveTab('new-claim')}
                            >
                              Submit Your First Claim
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {claims.slice(0, 5).map((claim) => (
                              <div
                                key={claim.id}
                                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 last:border-0"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {claim.claimType || 'Unknown'}
                                  </p>
                                  <p className="text-xs text-slate-500">{claim.trackingId}</p>
                                </div>
                                <Badge variant="outline" className={`text-[10px] shrink-0 ml-2 ${STATUS_COLORS[claim.status] || ''}`}>
                                  {claim.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* My Claims */}
                  <TabsContent value="claims" className="m-0 p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">My Claims</h3>
                    {claims.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 mb-4">You haven&apos;t filed any claims yet.</p>
                        <Button onClick={() => setActiveTab('new-claim')}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Submit a Claim
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {claims.map((claim) => (
                          <Card key={claim.id} className="border border-gray-200 dark:border-slate-700">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                                    {claim.claimType || 'Unknown Case Type'}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-0.5">{claim.trackingId}</p>
                                  {claim.description && (
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                                      {claim.description}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="outline" className={`text-[10px] shrink-0 ${STATUS_COLORS[claim.status] || ''}`}>
                                  {claim.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
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
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* New Claim */}
                  <TabsContent value="new-claim" className="m-0 p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Submit New Claim</h3>

                    {claimSuccess ? (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-slate-900 dark:text-white">Claim Submitted!</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Your claim has been received. We&apos;ll review it within 24-48 hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitClaim} className="space-y-4 max-w-lg">
                        <div className="space-y-2">
                          <Label className="text-sm">Case Type *</Label>
                          <select
                            value={newClaim.claimType}
                            onChange={(e) => setNewClaim({ ...newClaim, claimType: e.target.value })}
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm"
                            required
                          >
                            <option value="">Select case type...</option>
                            {caseTypes.map((ct) => (
                              <option key={ct} value={ct}>{ct}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Description *</Label>
                          <Textarea
                            value={newClaim.description}
                            onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
                            placeholder="Describe your situation, injuries, and how the product or exposure affected you..."
                            className="min-h-[120px]"
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={submittingClaim}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        >
                          {submittingClaim ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Submit Claim
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </TabsContent>

                  {/* Messages */}
                  <TabsContent value="messages" className="m-0 p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Messages</h3>
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-2">No messages yet.</p>
                      <p className="text-xs text-slate-400">
                        Claim updates and notifications will appear here.
                      </p>
                    </div>
                  </TabsContent>

                  {/* Settings */}
                  <TabsContent value="settings" className="m-0 p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Settings</h3>
                    <div className="space-y-4 max-w-lg">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">First Name</Label>
                          <Input
                            value={settingsForm.firstName}
                            onChange={(e) => setSettingsForm({ ...settingsForm, firstName: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Last Name</Label>
                          <Input
                            value={settingsForm.lastName}
                            onChange={(e) => setSettingsForm({ ...settingsForm, lastName: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Phone</Label>
                        <Input
                          type="tel"
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Email</Label>
                        <Input value={user.email} className="h-11 bg-gray-50 dark:bg-slate-800" disabled />
                      </div>

                      <div className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-4">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Change Password</h4>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Current Password</Label>
                            <Input
                              type="password"
                              value={settingsForm.currentPassword}
                              onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
                              className="h-11"
                              placeholder="Enter current password"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">New Password</Label>
                            <Input
                              type="password"
                              value={settingsForm.newPassword}
                              onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                              className="h-11"
                              placeholder="Min. 6 characters"
                            />
                          </div>
                        </div>
                      </div>

                      {settingsMsg && (
                        <p className={`text-sm ${settingsMsg.includes('success') ? 'text-emerald-600' : 'text-red-500'}`}>
                          {settingsMsg}
                        </p>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={handleSaveSettings}
                          disabled={savingSettings}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        >
                          {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <><Save className="w-4 h-4 mr-1.5" /> Save Changes</>
                          )}
                        </Button>
                        <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
                          <LogOut className="w-4 h-4 mr-1.5" /> Log Out
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
