'use client';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/utils';
import Image from 'next/image';
import { FiImage, FiMapPin, FiDollarSign, FiTag, FiFileText, FiType, FiAlertCircle } from 'react-icons/fi';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'LKR', 'JPY'];

function FieldLabel({ icon: Icon, children, optional }) {
  return (
    <label className="flex items-center gap-1.5 mb-2">
      <Icon className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
      <span className="text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>{children}</span>
      {optional && <span className="section-label ml-1">optional</span>}
    </label>
  );
}

export default function ListingForm({ initialData = {}, onSubmit, loading, submitLabel = 'Publish Experience' }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    location: initialData.location || '',
    imageUrl: initialData.imageUrl || '',
    description: initialData.description || '',
    price: initialData.price || '',
    currency: initialData.currency || 'USD',
    category: initialData.category || 'Other',
  });
  const [imgError, setImgError] = useState(false);

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (field === 'imageUrl') setImgError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: form.price ? parseFloat(form.price) : null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <FieldLabel icon={FiType}>Experience Title</FieldLabel>
        <input name="title" value={form.title} onChange={set('title')}
          placeholder="e.g., Sunset Boat Tour in Bali"
          required minLength={3} className="input-editorial" />
      </div>

      {/* Location */}
      <div>
        <FieldLabel icon={FiMapPin}>Location</FieldLabel>
        <input name="location" value={form.location} onChange={set('location')}
          placeholder="e.g., Bali, Indonesia" required className="input-editorial" />
      </div>

      {/* Image URL */}
      <div>
        <FieldLabel icon={FiImage}>Image URL</FieldLabel>
        <input name="imageUrl" value={form.imageUrl} onChange={set('imageUrl')}
          placeholder="https://images.unsplash.com/..." required className="input-editorial" />
        {form.imageUrl && !imgError && (
          <div className="mt-3 rounded overflow-hidden relative h-44 border" style={{ borderColor: 'var(--border)' }}>
            <Image src={form.imageUrl} alt="Preview" fill className="object-cover"
              onError={() => setImgError(true)} unoptimized />
            <div className="absolute inset-0 flex items-end p-3"
              style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.4) 0%, transparent 60%)' }}>
              <span className="text-xs text-white font-medium">Preview</span>
            </div>
          </div>
        )}
        {imgError && (
          <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: 'var(--coral)' }}>
            <FiAlertCircle className="w-3.5 h-3.5" />
            Could not load image. Please check the URL.
          </div>
        )}
        <p className="mt-1.5 text-xs" style={{ color: 'var(--muted)' }}>
          Use <a href="https://unsplash.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--gold)' }} className="underline underline-offset-2">Unsplash</a> for free high-quality travel photos.
        </p>
      </div>

      {/* Description */}
      <div>
        <FieldLabel icon={FiFileText}>Description</FieldLabel>
        <textarea name="description" value={form.description} onChange={set('description')}
          placeholder="Describe the experience in vivid detail — what will guests see, feel, and take away?"
          required minLength={10} rows={5}
          className="input-editorial resize-none" />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Be descriptive — it builds trust with travelers</span>
          <span className="text-xs" style={{ color: form.description.length > 1800 ? 'var(--coral)' : 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
            {form.description.length}/2000
          </span>
        </div>
      </div>

      {/* Price & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel icon={FiDollarSign} optional>Price</FieldLabel>
          <input name="price" type="number" value={form.price} onChange={set('price')}
            placeholder="45" min="0" step="0.01" className="input-editorial" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>Currency</label>
          <select name="currency" value={form.currency} onChange={set('currency')} className="input-editorial">
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <FieldLabel icon={FiTag}>Category</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter(c => c !== 'All').map((cat) => (
            <button type="button" key={cat}
              onClick={() => setForm({ ...form, category: cat })}
              className="px-3.5 py-2 rounded text-xs font-medium transition-all"
              style={{
                background: form.category === cat ? 'var(--ink)' : 'var(--white)',
                color: form.category === cat ? 'var(--white)' : 'var(--muted)',
                border: `1px solid ${form.category === cat ? 'var(--ink)' : 'var(--border)'}`,
                fontFamily: "'DM Sans', sans-serif",
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="divider-ornament">ready to publish</div>

      <button type="submit" disabled={loading} className="btn-teal w-full py-3.5 text-sm">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving...
          </span>
        ) : submitLabel}
      </button>
    </form>
  );
}
