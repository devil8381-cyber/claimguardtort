'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';

type Tab = 'login' | 'register' | 'otp';

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Register form
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  // OTP
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setTab(detail?.tab || 'register');
      setError('');
      setOpen(true);
    };
    window.addEventListener('open-auth', handleOpen);
    return () => window.removeEventListener('open-auth', handleOpen);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regForm.firstName || !regForm.lastName || !regForm.email || !regForm.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (regForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/claimants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regForm.firstName.trim(),
          lastName: regForm.lastName.trim(),
          email: regForm.email.trim(),
          phone: regForm.phone.trim() || undefined,
          password: regForm.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes('exists') || data.error?.includes('unique')) {
          setError('An account with this email already exists. Please log in.');
        } else {
          throw new Error(data.error || 'Registration failed');
        }
      } else {
        setOtpEmail(regForm.email.trim());
        setOtpSent(true);
        setTab('otp');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginForm.email || !loginForm.password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/claimants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          password: loginForm.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      if (data.token) {
        localStorage.setItem('cg_token', data.token);
        localStorage.setItem('cg_user', JSON.stringify(data.claimant));
        setOpen(false);
        window.dispatchEvent(new CustomEvent('auth-change'));
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/claimants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      if (data.token) {
        localStorage.setItem('cg_token', data.token);
        localStorage.setItem('cg_user', JSON.stringify(data.claimant));
        setOpen(false);
        window.dispatchEvent(new CustomEvent('auth-change'));
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-full p-0 gap-0 overflow-hidden sm:max-w-[90vw]">
        <DialogHeader className="sr-only">
          <DialogTitle>{tab === 'login' ? 'Log In' : tab === 'register' ? 'Create Account' : 'Verify Email'}</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {tab === 'login' && 'Welcome Back'}
              {tab === 'register' && 'Create Your Account'}
              {tab === 'otp' && 'Verify Your Email'}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {tab === 'register' && !otpSent && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleRegister}
                className="space-y-3.5"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="John"
                        value={regForm.firstName}
                        onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                        className="pl-9 h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Last Name *</Label>
                    <Input
                      placeholder="Smith"
                      value={regForm.lastName}
                      onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="pl-9 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Min. 6 characters"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4 ml-1" /></>}
                </Button>

                <p className="text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setTab('login'); setError(''); }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Log in
                  </button>
                </p>
              </motion.form>
            )}

            {tab === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLogin}
                className="space-y-3.5"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
                </Button>

                <p className="text-center text-xs text-slate-500">
                  Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => { setTab('register'); setError(''); }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Create one
                  </button>
                </p>
              </motion.form>
            )}

            {tab === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                  <Mail className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We sent a verification code to <strong>{otpEmail}</strong>
                </p>

                <div className="flex justify-center py-2">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-11 h-12 text-lg" />
                      <InputOTPSlot index={1} className="w-11 h-12 text-lg" />
                      <InputOTPSlot index={2} className="w-11 h-12 text-lg" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="w-11 h-12 text-lg" />
                      <InputOTPSlot index={4} className="w-11 h-12 text-lg" />
                      <InputOTPSlot index={5} className="w-11 h-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                </Button>

                <p className="text-xs text-slate-500">
                  Didn&apos;t receive it?{' '}
                  <button onClick={() => {}} className="text-blue-600 dark:text-blue-400 hover:underline">
                    Resend code
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
