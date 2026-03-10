'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getListing, toggleLike, toggleSave, deleteListing } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { timeAgo, formatPrice, CATEGORY_COLORS, getAvatarUrl } from '@/lib/utils';
import { FiMapPin, FiHeart, FiBookmark, FiEdit2, FiTrash2, FiArrowLeft, FiDollarSign, FiUser, FiLoader } from 'react-icons/fi';
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
    const fetch = async () => {
      try {
        const res = await getListing(id);
        setListing(res.data);
        setLikes(res.data.likes?.length || 0);
        setSaves(res.data.saved?.length || 0);
        setIsLiked(res.data.likes?.includes(user?._id));
        setIsSaved(res.data.saved?.includes(user?._id));
      } catch {
        toast.error('Listing not found');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { toast.error('Login to like'); return; }
    const res = await toggleLike(id);
    setLikes(res.data.likes);
    setIsLiked(res.data.isLiked);
  };

  const handleSave = async () => {
    if (!user) { toast.error('Login to save'); return; }
    const res = await toggleSave(id);
    setSaves(res.data.saved);
    setIsSaved(res.data.isSaved);
    toast.success(res.data.isSaved ? 'Saved to your list!' : 'Removed from saved');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return;
    setDeleting(true);
    try {
      await deleteListing(id);
      toast.success('Listing deleted');
      router.push('/');
    } catch {
      toast.error('Failed to delete');
      setDeleting(false);
    }
  };

  const isOwner = user && listing && listing.creator?._id === user._id;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <FiLoader className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );

  if (!listing) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <FiArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>

      <div className="card overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-80 w-full">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            unoptimized
          />
          {listing.category && listing.category !== 'Other' && (
            <span className={`badge absolute top-4 left-4 ${CATEGORY_COLORS[listing.category]}`}>
              {listing.category}
            </span>
          )}
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleLike}
              className={`p-2.5 rounded-xl backdrop-blur-sm transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}>
              <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={handleSave}
              className={`p-2.5 rounded-xl backdrop-blur-sm transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}>
              <FiBookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-500">
                <FiMapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-lg">{listing.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {formatPrice(listing.price, listing.currency)}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">per person</div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {likes} {likes === 1 ? 'like' : 'likes'}
            </span>
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <FiBookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-500 text-emerald-500' : ''}`} />
              {saves} saved
            </span>
            <span className="text-gray-400 text-sm ml-auto">{timeAgo(listing.createdAt)}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">About this experience</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Creator Card */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 mb-5">
            <Image
              src={getAvatarUrl(listing.creator)}
              alt={listing.creator?.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
              unoptimized
            />
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-0.5">
                <FiUser className="w-3.5 h-3.5" /> Experience by
              </div>
              <p className="font-semibold text-gray-900">{listing.creator?.name}</p>
              {listing.creator?.bio && (
                <p className="text-sm text-gray-500 mt-0.5">{listing.creator.bio}</p>
              )}
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Link href={`/listings/${listing._id}/edit`} className="btn-secondary flex items-center gap-2">
                <FiEdit2 className="w-4 h-4" /> Edit Listing
              </Link>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger flex items-center gap-2">
                <FiTrash2 className="w-4 h-4" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
