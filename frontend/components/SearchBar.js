'use client';
import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { CATEGORIES } from '@/lib/utils';

export default function SearchBar({ onSearch, onCategoryChange, activeCategory }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => { e.preventDefault(); onSearch(query); };
  const handleClear = () => { setQuery(''); onSearch(''); };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, experiences..."
            className="input-editorial pl-11 pr-10"
          />
          {query && (
            <button type="button" onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:bg-sand"
              style={{ color: 'var(--muted)' }}>
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button type="submit" className="btn-gold py-3 px-6 text-xs">Search</button>
      </form>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className="transition-all duration-200 text-xs font-medium tracking-wide px-4 py-2 rounded"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.02em',
              background: activeCategory === cat ? 'var(--ink)' : 'var(--white)',
              color: activeCategory === cat ? 'var(--white)' : 'var(--muted)',
              border: `1px solid ${activeCategory === cat ? 'var(--ink)' : 'var(--border)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
