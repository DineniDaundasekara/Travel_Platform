'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getAvatarUrl } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiCompass, FiPlus, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success('See you soon ✦');
    router.push('/');
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(250,248,245,0.95)' : 'var(--surface)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 4px 24px rgba(13,13,13,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center transition-colors"
              style={{ background: 'var(--gold)' }}
            >
              <FiCompass className="w-4 h-4 text-white" />
            </div>

            {/* Same font style like Sign In */}
            <span
              className="text-xl font-medium tracking-tight"
              style={{
                color: 'var(--ink-soft)',
                fontFamily: 'inherit',
              }}
            >
              Wanderlust
            </span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="section-label transition-colors hover:text-amber-700"
              style={{ color: pathname === '/' ? 'var(--gold)' : 'var(--muted)' }}
            >
              Explore
            </Link>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/create" className="btn-gold text-xs py-2.5 px-5">
                      <FiPlus className="w-3.5 h-3.5" />
                      New Experience
                    </Link>

                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded transition-colors hover:bg-sand"
                        style={{ background: dropdownOpen ? 'var(--sand)' : 'transparent' }}
                      >
                        <Image
                          src={getAvatarUrl(user)}
                          alt={user.name}
                          width={30}
                          height={30}
                          className="rounded-sm object-cover"
                          unoptimized
                        />
                        <span className="text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>
                          {user.name.split(' ')[0]}
                        </span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                          style={{ color: 'var(--muted)' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <div
                          className="absolute right-0 mt-1.5 w-52 rounded overflow-hidden animate-fade-in"
                          style={{
                            background: 'var(--white)',
                            border: '1px solid var(--border)',
                            boxShadow: '0 12px 40px rgba(13,13,13,0.12)',
                          }}
                        >
                          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                            <p className="text-xs font-medium" style={{ color: 'var(--ink)' }}>{user.name}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>{user.email}</p>
                          </div>
                          <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-sand"
                            style={{ color: 'var(--ink-soft)' }}
                          >
                            <FiUser className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                            My Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-red-50 border-t"
                            style={{ color: 'var(--coral)', borderColor: 'var(--border)' }}
                          >
                            <FiLogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="btn-ghost text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="btn-gold text-xs py-2.5">
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded transition-colors hover:bg-sand"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen
              ? <FiX className="w-5 h-5" style={{ color: 'var(--ink)' }} />
              : <FiMenu className="w-5 h-5" style={{ color: 'var(--ink)' }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t animate-fade-in"
          style={{ borderColor: 'var(--border)', background: 'var(--white)' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-3 mb-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <Image
                    src={getAvatarUrl(user)}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="rounded-sm object-cover"
                    unoptimized
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{user.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{user.email}</p>
                  </div>
                </div>
                <Link href="/create" className="block px-3 py-2.5 text-sm font-medium rounded" style={{ color: 'var(--gold)' }}>
                  + New Experience
                </Link>
                <Link href="/profile" className="block px-3 py-2.5 text-sm rounded" style={{ color: 'var(--ink-soft)' }}>
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2.5 text-sm rounded"
                  style={{ color: 'var(--coral)' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-3 py-2.5 text-sm" style={{ color: 'var(--ink-soft)' }}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="block px-3 py-2.5 text-sm font-medium" style={{ color: 'var(--gold)' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}