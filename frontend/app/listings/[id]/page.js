'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getListing, toggleLike, toggleSave, deleteListing } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { timeAgo, formatPrice, getAvatarUrl } from '@/lib/utils';
import { FiMapPin, FiHeart, FiBookmark, FiEdit2, FiTrash2, FiArrowLeft, FiLoader, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [saves, setSaves] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getListing(id)
      .then(res => {
        setListing(res.data);
        setLikes(res.data.likes?.length || 0);
        setSaves(res.data.saved?.length || 0);
        setIsLiked(res.data.likes?.includes(user?._id));
        setIsSaved(res.data.saved?.includes(user?._id));
      })
      .catch(() => { toast.error('Listing not found'); router.push('/'); })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { toast.error('Sign in to like'); return; }
    const res = await toggleLike(id);
    setLikes(res.data.likes); setIsLiked(res.data.isLiked);
  };

  const handleSave = async () => {
    if (!user) { toast.error('Sign in to save'); return; }
    const res = await toggleSave(id);
    setSaves(res.data.saved); setIsSaved(res.data.isSaved);
    toast.success(res.data.isSaved ? 'Saved ✦' : 'Removed from saved');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteListing(id);
      toast.success('Listing deleted');
      router.push('/');
    } catch { toast.error('Failed to delete'); setDeleting(false); }
  };

  const isOwner = user && listing && listing.creator?._id === user._id;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <FiLoader className="w-7 h-7 animate-spin" style={{ color: 'var(--gold)' }} />
    </div>
  );
  if (!listing) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-60"
        style={{ color: 'var(--muted)' }}>
        <FiArrowLeft className="w-4 h-4" /> Back to explore
      </Link>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main content */}
        <div>
          {/* Hero image */}
          <div className="relative h-[420px] rounded overflow-hidden img-overlay mb-8">
            <Image src={listing.imageUrl} alt={listing.title} fill
              className="object-cover" unoptimized />
            {listing.category && listing.category !== 'Other' && (
              <span className="tag tag-dark absolute top-5 left-5 z-20">{listing.category}</span>
            )}
          </div>

          {/* Title block */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
              <span className="section-label">{listing.location}</span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight mb-2" style={{ color: 'var(--ink)' }}>
              {listing.title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Published {timeAgo(listing.createdAt)}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px mb-6" style={{ background: 'var(--border)' }} />

          {/* Description */}
          <div className="mb-8">
            <p className="section-label mb-3">About this experience</p>
            <p className="leading-relaxed whitespace-pre-line text-base"
              style={{ color: 'var(--ink-soft)', lineHeight: '1.8' }}>
              {listing.description}
            </p>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-3 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <Link href={`/listings/${listing._id}/edit`} className="btn-outline gap-2 text-xs py-2.5">
                <FiEdit2 className="w-3.5 h-3.5" /> Edit Listing
              </Link>
              <button onClick={handleDelete} disabled={deleting}
                className="btn-outline gap-2 text-xs py-2.5 transition-colors"
                style={{ color: 'var(--coral)', borderColor: 'rgba(212,95,60,0.3)' }}>
                <FiTrash2 className="w-3.5 h-3.5" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="p-6 rounded" style={{ background: 'var(--ink)' }}>
            <p className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Price per person</p>
            <p className="font-display text-4xl font-bold" style={{ color: 'var(--gold-light)' }}>
              {formatPrice(listing.price, listing.currency)}
            </p>
            <div className="flex gap-2 mt-5">
              <button onClick={handleLike}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded text-sm font-medium transition-all"
                style={{
                  background: isLiked ? 'rgba(212,95,60,0.2)' : 'rgba(255,255,255,0.08)',
                  color: isLiked ? '#e8846a' : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${isLiked ? 'rgba(212,95,60,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                <FiHeart className="w-4 h-4" style={{ fill: isLiked ? 'currentColor' : 'none' }} />
                {likes}
              </button>
              <button onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded text-sm font-medium transition-all"
                style={{
                  background: isSaved ? 'rgba(201,151,58,0.2)' : 'rgba(255,255,255,0.08)',
                  color: isSaved ? 'var(--gold-light)' : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${isSaved ? 'rgba(201,151,58,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                <FiBookmark className="w-4 h-4" style={{ fill: isSaved ? 'currentColor' : 'none' }} />
                Save
              </button>
            </div>
          </div>

          {/* Creator card */}
          <div className="p-5 rounded" style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
            <p className="section-label mb-4">Experience by</p>
            <div className="flex items-center gap-3">
              <Image src={getAvatarUrl(listing.creator)} alt={listing.creator?.name}
                width={44} height={44} className="rounded object-cover" unoptimized />
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{listing.creator?.name}</p>
                {listing.creator?.bio && (
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {listing.creator.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-5 rounded" style={{ background: 'var(--sand)', border: '1px solid var(--border)' }}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Likes', value: likes },
                { label: 'Saves', value: saves },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold" style={{ color: 'var(--ink)' }}>{stat.value}</p>
                  <p className="section-label mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
