'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { getAvatarUrl } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCompass, FiPlus, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    router.push('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <FiCompass className="w-6 h-6" />
            <span>Wanderlust</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/create" className="btn-primary flex items-center gap-2 text-sm">
                      <FiPlus className="w-4 h-4" />
                      Add Experience
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Image
                          src={getAvatarUrl(user)}
                          alt={user.name}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                        <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                      </button>
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                          <Link href="/profile" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                            <FiUser className="w-4 h-4" /> My Profile
                          </Link>
                          <button onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                            <FiLogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="btn-secondary text-sm">Login</Link>
                    <Link href="/auth/register" className="btn-primary text-sm">Sign Up</Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <Link href="/create" className="block px-3 py-2 text-sm font-medium text-emerald-600"
                  onClick={() => setMenuOpen(false)}>+ Add Experience</Link>
                <Link href="/profile" className="block px-3 py-2 text-sm"
                  onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-3 py-2 text-sm"
                  onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/auth/register" className="block px-3 py-2 text-sm font-medium text-emerald-600"
                  onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
