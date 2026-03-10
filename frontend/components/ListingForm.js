'use client';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/utils';
import Image from 'next/image';
import { FiImage, FiMapPin, FiDollarSign, FiTag, FiFileText, FiType } from 'react-icons/fi';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'LKR', 'JPY'];

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
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'imageUrl') setImageError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: form.price ? parseFloat(form.price) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          <FiType className="inline w-4 h-4 mr-1" />Experience Title *
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g., Sunset Boat Tour in Bali"
          required
          minLength={3}
          className="input-field"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          <FiMapPin className="inline w-4 h-4 mr-1" />Location *
        </label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g., Bali, Indonesia"
          required
          className="input-field"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          <FiImage className="inline w-4 h-4 mr-1" />Image URL *
        </label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
          required
          className="input-field"
        />
        {form.imageUrl && !imageError && (
          <div className="mt-2 rounded-xl overflow-hidden h-40 relative">
            <Image src={form.imageUrl} alt="Preview" fill className="object-cover"
              onError={() => setImageError(true)} unoptimized />
          </div>
        )}
        {imageError && (
          <p className="text-xs text-red-500 mt-1">⚠️ Could not load image from this URL</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Tip: Use{' '}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-emerald-500 underline">Unsplash</a>
          {' '}for free high-quality travel photos.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          <FiFileText className="inline w-4 h-4 mr-1" />Description *
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the experience in detail..."
          required
          minLength={10}
          rows={5}
          className="input-field resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{form.description.length}/2000 characters</p>
      </div>

      {/* Price & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <FiDollarSign className="inline w-4 h-4 mr-1" />Price (optional)
          </label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="45"
            min="0"
            step="0.01"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
          <select name="currency" value={form.currency} onChange={handleChange} className="input-field">
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          <FiTag className="inline w-4 h-4 mr-1" />Category
        </label>
        <select name="category" value={form.category} onChange={handleChange} className="input-field">
          {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full text-center py-3">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Saving...
          </span>
        ) : submitLabel}
      </button>
    </form>
  );
}
