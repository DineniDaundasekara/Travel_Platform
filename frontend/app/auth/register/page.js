'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';

const PERKS = ['Share your travel experiences', 'Connect with global travelers', 'Build your explorer profile'];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Welcome to Wanderlust ✦');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: 'var(--surface)' }}>
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-10">
            <span className="accent-line" />
            <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Create Account</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: 'var(--gold)' }} className="font-medium hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', icon: FiUser, type: 'text', placeholder: 'Jane Smith', min: 2 },
              { field: 'email', label: 'Email', icon: FiMail, type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'Password', icon: FiLock, type: 'password', placeholder: 'Min 6 characters', min: 6 },
              { field: 'confirm', label: 'Confirm Password', icon: FiLock, type: 'password', placeholder: '••••••••' },
            ].map(({ field, label, icon: Icon, type, placeholder, min }) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <input type={type} value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={placeholder} required minLength={min}
                    className="input-editorial pl-11" />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mt-2">
              {loading ? 'Creating account...' : <><span>Create Account</span><FiArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>

      {/* Right — decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center p-12"
        style={{ background: 'var(--sand-dark)' }}>
        <div className="relative z-10 max-w-sm">
          <p className="section-label mb-4" style={{ color: 'var(--muted)' }}>✦ Join the community</p>
          <h2 className="font-display text-4xl font-bold leading-tight mb-8" style={{ color: 'var(--ink)' }}>
            Your next great adventure<br />
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>starts here.</span>
          </h2>
          <div className="space-y-4">
            {PERKS.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--gold)' }}>
                  <FiCheck className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'var(--gold)' }} />
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'var(--teal)' }} />
      </div>
    </div>
  );
}
