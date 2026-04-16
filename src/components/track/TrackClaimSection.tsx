'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, XCircle, Clock, FileText, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_CONFIG: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  'Under Review': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Search },
  'Correction Needed': { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: AlertTriangle },
  Approved: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  Denied: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

const PIPELINE = ['Submitted', 'Validated', 'Under Review', 'Decision', 'Completed'];

const STATUS_TO_PIPELINE: Record<string, number> = {
  Pending: 0,
  Submitted: 0,
  Validated: 1,
  'Under Review': 2,
  'Correction Needed': 2,
  Decision: 3,
  Approved: 4,
  Denied: 4,
  Completed: 4,
};

interface ClaimResult {
  trackingId: string;
  status: string;
  claimType: string | null;
  description: string | null;
  filedDate: string;
  lastUpdated: string;
  notes: string | null;
  nextSteps: string | null;
  progress: number;
  claimant: { firstName: string; lastName: string };
  history: { status: string; notes: string | null; date: string }[];
}

export default function TrackClaimSection() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/claims/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: trackingId.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Claim not found');
      }

      setResult(data.claim);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    if (result) {
      navigator.clipboard.writeText(result.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pipelineIndex = result ? STATUS_TO_PIPELINE[result.status] ?? 0 : 0;

  return (
    <section id="track-claim" className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide uppercase mb-4">
            Track Your Claim
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Real-Time Claim Status
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
            Enter your tracking ID to see where your claim stands.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="flex gap-2 sm:gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Enter Tracking ID (e.g., CLM-2024-001)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="pl-11 h-12 md:h-14 text-sm md:text-base bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 md:px-8 h-12 md:h-14 font-semibold"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
          </Button>
        </form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center mb-6"
            >
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Status Card */}
              <Card className="border border-gray-200 dark:border-slate-700">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          Claim Found
                        </h3>
                        <button
                          onClick={copyId}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          title="Copy ID"
                        >
                          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 font-mono">{result.trackingId}</p>
                    </div>
                    <Badge className={`text-xs ${STATUS_CONFIG[result.status]?.color || ''}`}>
                      {result.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Claim Type</span>
                      <p className="font-medium text-slate-900 dark:text-white">{result.claimType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Filed Date</span>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {new Date(result.filedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Last Updated</span>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {new Date(result.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Claimant</span>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {result.claimant.firstName} {result.claimant.lastName}
                      </p>
                    </div>
                  </div>

                  {result.description && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <p className="text-sm text-slate-600 dark:text-slate-400">{result.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pipeline */}
              <Card className="border border-gray-200 dark:border-slate-700">
                <CardContent className="p-5 md:p-6">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-5">Claim Pipeline</h4>
                  <div className="relative">
                    <div className="hidden sm:block absolute top-5 left-[10%] right-[10%] h-1 bg-gray-200 dark:bg-slate-700 rounded-full" />
                    <div className="grid grid-cols-5 gap-2">
                      {PIPELINE.map((stage, i) => {
                        const isActive = i <= pipelineIndex;
                        const isCurrent = i === pipelineIndex;
                        return (
                          <div key={stage} className="flex flex-col items-center text-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all ${
                                isCurrent
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-900/50'
                                  : isActive
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-200 dark:bg-slate-700 text-slate-400'
                              }`}
                            >
                              {isActive && !isCurrent ? '✓' : i + 1}
                            </div>
                            <span
                              className={`mt-2 text-[10px] sm:text-xs font-medium leading-tight ${
                                isCurrent
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : isActive
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes & Next Steps */}
              {(result.notes || result.nextSteps) && (
                <Card className="border border-gray-200 dark:border-slate-700">
                  <CardContent className="p-5 md:p-6 space-y-3">
                    {result.notes && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Important Notes</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result.notes}</p>
                      </div>
                    )}
                    {result.nextSteps && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Next Steps</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result.nextSteps}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* History */}
              {result.history && result.history.length > 0 && (
                <Card className="border border-gray-200 dark:border-slate-700">
                  <CardContent className="p-5 md:p-6">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">Claim History</h4>
                    <div className="space-y-3">
                      {result.history.map((entry, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${STATUS_CONFIG[entry.status]?.color.split(' ')[0] || 'bg-gray-300'}`} />
                            {i < result.history.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-200 dark:bg-slate-700 mt-1" />
                            )}
                          </div>
                          <div className="pb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{entry.status}</span>
                              <span className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                            {entry.notes && (
                              <p className="text-xs text-slate-500 mt-0.5">{entry.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help */}
              <div className="text-center pt-2">
                <p className="text-sm text-slate-500">
                  Need help with your claim?{' '}
                  <button
                    onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Contact our support team
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
