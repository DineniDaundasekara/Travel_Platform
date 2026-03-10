'use client';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ListingForm from '@/components/ListingForm';
import { createListing } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await createListing(data);
      toast.success('Experience published! 🎉');
      router.push(`/listings/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <FiPlus className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Experience</h1>
            <p className="text-gray-500 text-sm">Share your travel experience with the world</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <ListingForm onSubmit={handleSubmit} loading={submitting} submitLabel="Publish Experience 🚀" />
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Changed your mind?{' '}
        <Link href="/" className="text-emerald-500 hover:underline">Back to feed</Link>
      </p>
    </div>
  );
}
