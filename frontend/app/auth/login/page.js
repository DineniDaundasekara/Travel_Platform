'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back ✦');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-end p-12"
        style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 'var(--login-bg-opacity, 0.4)',
          }} />
        <div className="relative z-10">
          <p className="section-label mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>✦ Wanderlust</p>
          <h2 className="font-display text-4xl font-bold leading-tight mb-4" style={{ color: 'var(--white)' }}>
            The world is waiting<br />
            <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>for you to explore it.</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Join thousands of travelers discovering extraordinary experiences curated by passionate local guides.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: 'var(--surface)' }}>
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-10">
            <span className="accent-line" />
            <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Sign In</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              New here?{' '}
              <Link href="/auth/register" style={{ color: 'var(--gold)' }} className="font-medium hover:underline underline-offset-2">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" required className="input-editorial pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required className="input-editorial pl-11" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mt-2">
              {loading ? 'Signing in...' : <><span>Continue</span><FiArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 p-4 rounded" style={{ background: 'var(--sand)', border: '1px solid var(--border)' }}>
            <p className="section-label mb-1">Demo credentials</p>
            <p className="text-xs" style={{ color: 'var(--ink-soft)', fontFamily: "'DM Mono', monospace" }}>
              demo@wanderlust.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
