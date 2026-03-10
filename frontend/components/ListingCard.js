'use client';
import Link from 'next/link';
import Image from 'next/image';
import { timeAgo, formatPrice, CATEGORY_COLORS, getAvatarUrl } from '@/lib/utils';
import { FiMapPin, FiHeart, FiBookmark, FiClock } from 'react-icons/fi';
import { useAuth } from '@/lib/AuthContext';
import { toggleLike, toggleSave } from '@/lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ListingCard({ listing, onUpdate }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(listing.likes?.length || 0);
  const [saves, setSaves] = useState(listing.saved?.length || 0);
  const [isLiked, setIsLiked] = useState(listing.likes?.includes(user?._id));
  const [isSaved, setIsSaved] = useState(listing.saved?.includes(user?._id));

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to like'); return; }
    try {
      const res = await toggleLike(listing._id);
      setLikes(res.data.likes);
      setIsLiked(res.data.isLiked);
    } catch { toast.error('Failed to like'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to save'); return; }
    try {
      const res = await toggleSave(listing._id);
      setSaves(res.data.saved);
      setIsSaved(res.data.isSaved);
      toast.success(res.data.isSaved ? 'Saved!' : 'Removed from saved');
    } catch { toast.error('Failed to save'); }
  };

  return (
    <Link href={`/listings/${listing._id}`} className="card group block">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {listing.category && listing.category !== 'Other' && (
          <span className={`badge absolute top-3 left-3 ${CATEGORY_COLORS[listing.category]}`}>
            {listing.category}
          </span>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button onClick={handleSave}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}>
            <FiBookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>
          <span className="text-emerald-600 font-semibold text-sm whitespace-nowrap">
            {formatPrice(listing.price, listing.currency)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <Image
              src={getAvatarUrl(listing.creator)}
              alt={listing.creator?.name || ''}
              width={24}
              height={24}
              className="rounded-full object-cover"
              unoptimized
            />
            <span className="text-xs text-gray-600 font-medium truncate max-w-[100px]">
              {listing.creator?.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
              <FiHeart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FiClock className="w-3.5 h-3.5" />
              <span>{timeAgo(listing.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
