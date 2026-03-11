'use client';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ListingForm from '@/components/ListingForm';
import { createListing } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

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
      toast.success('Experience published ✦');
      router.push(`/listings/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish');
    } finally { setSubmitting(false); }
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
        style={{ color: 'var(--muted)' }}>
        <FiArrowLeft className="w-4 h-4" /> Back to feed
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        {/* Main form */}
        <div>
          <span className="accent-line" />
          <h1 className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
            Share an Experience
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            Tell travelers what makes your experience extraordinary.
          </p>
          <div className="p-8 rounded" style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
            <ListingForm onSubmit={handleSubmit} loading={submitting} submitLabel="Publish Experience ✦" />
          </div>
        </div>

        {/* Tips panel */}
        <div className="hidden lg:block">
          <div className="sticky top-24 p-6 rounded space-y-6"
            style={{ background: 'var(--sand)', border: '1px solid var(--border)' }}>
            <div>
              <p className="section-label mb-3">✦ Tips for a great listing</p>
              <ul className="space-y-3">
                {[
                  'Use a high-quality landscape photo — first impressions matter.',
                  'Be specific about location. "Ubud, Bali" beats just "Indonesia".',
                  'Describe what makes your experience unique and memorable.',
                  'Be transparent about pricing — it builds trust.',
                  'Mention what\'s included: equipment, meals, transport etc.',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{ color: 'var(--ink-soft)' }}>
                    <span className="font-display font-bold flex-shrink-0"
                      style={{ color: 'var(--gold)' }}>{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="section-label mb-2">photo tip</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                Visit <a href="https://unsplash.com" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--gold)' }} className="underline underline-offset-2">Unsplash.com</a>,
                {' '}search your destination, right-click any photo → "Copy image address" and paste it in the Image URL field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
