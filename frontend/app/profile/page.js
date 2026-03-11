'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserListings, updateProfile } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import Image from 'next/image';
import { getAvatarUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiLoader, FiCompass, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (user) setForm({ name: user.name, bio: user.bio || '', avatar: user.avatar || '' });
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      getUserListings(user._id)
        .then(res => setListings(res.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data);
      toast.success('Profile updated ✦');
      setEditing(false);
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (authLoading || !user) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 animate-fade-in">
      {/* Profile header */}
      <div className="mb-12">
        <div className="p-8 rounded" style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <Image src={getAvatarUrl(user)} alt={user.name}
                width={88} height={88}
                className="rounded object-cover"
                style={{ border: '3px solid var(--border)' }}
                unoptimized />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-sm flex items-center justify-center"
                style={{ background: 'var(--gold)' }}>
                <span className="text-white text-xs font-bold">✦</span>
              </div>
            </div>

            <div className="flex-1">
              {editing ? (
                <div className="space-y-3 max-w-md">
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="input-editorial font-display text-xl font-bold" placeholder="Your name" />
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                    className="input-editorial resize-none text-sm" rows={2}
                    placeholder="A short bio..." maxLength={200} />
                  <input value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })}
                    className="input-editorial text-sm" placeholder="Avatar URL (optional)" />
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleSave} disabled={saving} className="btn-gold py-2 px-4 text-xs">
                      <FiSave className="w-3.5 h-3.5" />
                      {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-outline py-2 px-4 text-xs">
                      <FiX className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>{user.name}</h1>
                    <button onClick={() => setEditing(true)} className="btn-ghost p-1.5">
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>{user.email}</p>
                  {user.bio && (
                    <p className="text-sm leading-relaxed mb-3 max-w-lg" style={{ color: 'var(--ink-soft)' }}>{user.bio}</p>
                  )}
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="font-display text-xl font-bold" style={{ color: 'var(--ink)' }}>{listings.length}</span>
                      <span className="section-label ml-2">experience{listings.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!editing && (
              <Link href="/create" className="btn-gold text-xs py-2.5 hidden sm:inline-flex">
                <FiPlus className="w-3.5 h-3.5" /> New Experience
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Listings grid */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="accent-line" style={{ marginBottom: '8px' }} />
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--ink)' }}>My Experiences</h2>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <FiLoader className="w-7 h-7 animate-spin" style={{ color: 'var(--gold)' }} />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 rounded" style={{ background: 'var(--sand)', border: '1px solid var(--border)' }}>
          <p className="font-display text-5xl mb-4" style={{ color: 'var(--border)' }}>✦</p>
          <h3 className="font-display text-xl mb-2" style={{ color: 'var(--ink-soft)' }}>No experiences yet</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Share your first travel experience with the world.</p>
          <Link href="/create" className="btn-gold">Create Experience</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing, i) => (
            <div key={listing._id} className="animate-fade-up"
              style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
