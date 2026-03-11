'use client';
import Link from 'next/link';
import Image from 'next/image';
import { timeAgo, formatPrice, CATEGORY_COLORS, getAvatarUrl } from '@/lib/utils';
import { FiMapPin, FiHeart, FiBookmark } from 'react-icons/fi';
import { useAuth } from '@/lib/AuthContext';
import { toggleLike, toggleSave } from '@/lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ListingCard({ listing }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(listing.likes?.length || 0);
  const [saves, setSaves] = useState(listing.saved?.length || 0);
  const [isLiked, setIsLiked] = useState(listing.likes?.includes(user?._id));
  const [isSaved, setIsSaved] = useState(listing.saved?.includes(user?._id));
  const [imgError, setImgError] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error('Sign in to like'); return; }
    try {
      const res = await toggleLike(listing._id);
      setLikes(res.data.likes); setIsLiked(res.data.isLiked);
    } catch { }
  };

  const handleSave = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error('Sign in to save'); return; }
    try {
      const res = await toggleSave(listing._id);
      setSaves(res.data.saved); setIsSaved(res.data.isSaved);
      toast.success(res.data.isSaved ? 'Saved ✦' : 'Removed from saved');
    } catch { }
  };

  return (
    <Link href={`/listings/${listing._id}`} className="card-listing group block">
      {/* Image */}
      <div className="relative h-52 overflow-hidden img-overlay">
        {!imgError ? (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-108"
            style={{ transform: 'scale(1)', transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--sand-dark)' }}>
            <span style={{ color: 'var(--muted)', fontSize: '2rem' }}>✦</span>
          </div>
        )}

        {/* Category badge */}
        {listing.category && listing.category !== 'Other' && (
          <span className="tag tag-dark absolute top-3 left-3 z-20">
            {listing.category}
          </span>
        )}

        {/* Save button */}
        <button onClick={handleSave} className="absolute top-3 right-3 z-20 w-8 h-8 rounded flex items-center justify-center transition-all"
          style={{ background: isSaved ? 'var(--gold)' : 'rgba(250,248,245,0.9)' }}>
          <FiBookmark className="w-3.5 h-3.5" style={{ color: isSaved ? 'white' : 'var(--ink)' }} />
        </button>

        {/* Price overlay at bottom */}
        {listing.price && (
          <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded text-xs font-semibold"
            style={{ background: 'var(--gold)', color: 'white', fontFamily: "'DM Mono', monospace" }}>
            {formatPrice(listing.price, listing.currency)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <FiMapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--gold)' }} />
          <span className="section-label text-xs" style={{ color: 'var(--muted)' }}>{listing.location}</span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold leading-snug mb-2 transition-colors group-hover:text-amber-700"
          style={{ fontSize: '1.0625rem', color: 'var(--ink)', lineHeight: '1.3' }}>
          {listing.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed line-clamp-2 mb-4"
          style={{ color: 'var(--muted)', fontSize: '0.8125rem' }}>
          {listing.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t"
          style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Image
              src={getAvatarUrl(listing.creator)}
              alt={listing.creator?.name || ''}
              width={22}
              height={22}
              className="rounded-sm object-cover"
              unoptimized
            />
            <span className="text-xs font-medium truncate max-w-[90px]"
              style={{ color: 'var(--ink-soft)' }}>
              {listing.creator?.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleLike}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: isLiked ? 'var(--coral)' : 'var(--muted)' }}>
              <FiHeart className="w-3.5 h-3.5" style={{ fill: isLiked ? 'currentColor' : 'none' }} />
              <span style={{ fontFamily: "'DM Mono', monospace" }}>{likes}</span>
            </button>
            <span className="text-xs" style={{ color: 'var(--border)', fontFamily: "'DM Mono', monospace" }}>
              {timeAgo(listing.createdAt).replace(' ago', '')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
