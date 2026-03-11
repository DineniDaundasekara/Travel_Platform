'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getListing, updateListing } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import ListingForm from '@/components/ListingForm';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    getListing(id).then(res => {
      if (res.data.creator?._id !== user._id) {
        toast.error('Not authorized'); router.push('/'); return;
      }
      setListing(res.data);
    }).catch(() => { toast.error('Not found'); router.push('/'); })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await updateListing(id, data);
      toast.success('Listing updated ✦');
      router.push(`/listings/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSubmitting(false); }
  };

  if (loading || authLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <FiLoader className="w-7 h-7 animate-spin" style={{ color: 'var(--gold)' }} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-up">
      <Link href={`/listings/${id}`} className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-60 transition-opacity"
        style={{ color: 'var(--muted)' }}>
        <FiArrowLeft className="w-4 h-4" /> Back to listing
      </Link>

      <span className="accent-line" />
      <h1 className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--ink)' }}>Edit Experience</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>Update your listing details.</p>

      <div className="p-8 rounded" style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
        {listing && (
          <ListingForm initialData={listing} onSubmit={handleSubmit} loading={submitting} submitLabel="Save Changes" />
        )}
      </div>
    </div>
  );
}
