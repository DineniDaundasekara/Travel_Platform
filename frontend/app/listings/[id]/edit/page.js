'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getListing, updateListing } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import ListingForm from '@/components/ListingForm';
import toast from 'react-hot-toast';
import { FiEdit2, FiLoader } from 'react-icons/fi';
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
    const fetch = async () => {
      try {
        const res = await getListing(id);
        if (res.data.creator?._id !== user?._id) {
          toast.error('Not authorized');
          router.push('/');
          return;
        }
        setListing(res.data);
      } catch {
        toast.error('Listing not found');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetch();
  }, [id, user]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await updateListing(id, data);
      toast.success('Listing updated!');
      router.push(`/listings/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <FiLoader className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <FiEdit2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Experience</h1>
          <p className="text-gray-500 text-sm">Update your listing details</p>
        </div>
      </div>

      <div className="card p-6">
        {listing && (
          <ListingForm
            initialData={listing}
            onSubmit={handleSubmit}
            loading={submitting}
            submitLabel="Save Changes"
          />
        )}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        <Link href={`/listings/${id}`} className="text-emerald-500 hover:underline">Cancel</Link>
      </p>
    </div>
  );
}
