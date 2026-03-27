'use client';
import { useState, useEffect, useCallback } from 'react';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import { getListings } from '@/lib/api';
import Link from 'next/link';
import { FiArrowRight, FiLoader } from 'react-icons/fi';

const STATS = [
  { value: '120+', label: 'Destinations' },
  { value: '2.4k', label: 'Experiences' },
  { value: '18k', label: 'Travelers' },
];

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchListings = useCallback(async (reset = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const currentPage = reset ? 1 : page;
      const params = { page: currentPage, limit: 12 };

      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const res = await getListings(params);
      const { listings: newListings, pages, total: t } = res.data;

      setListings(reset ? newListings : (prev) => [...prev, ...newListings]);
      setTotalPages(pages);
      setTotal(t);

      if (!reset) setPage(currentPage + 1);
      else setPage(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchListings(true);
  }, [search, category]);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-bg noise-overlay relative overflow-hidden">
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.22)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="max-w-3xl">
            <p
              className="section-label animate-fade-up stagger-1 mb-5"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              ✦ Curated Travel Experiences
            </p>

            <h1
              className="font-display animate-fade-up stagger-2 mb-6 leading-[1.1]"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: '#ffffff',
                fontWeight: 900,
                textShadow: '0 3px 12px rgba(0,0,0,0.35)',
              }}
            >
              Discover the World's
              <br />
              <span
                style={{
                  color: 'var(--gold)',
                  
                  textShadow: '0 3px 12px rgba(0,0,0,0.25)',
                }}
              >
                Hidden Wonders
              </span>
            </h1>

            <p
              className="animate-fade-up stagger-3 mb-8 text-lg leading-relaxed max-w-xl"
              style={{
                color: '#ffffff',
                fontWeight: 700,
                textShadow: '0 2px 8px rgba(0,0,0,0.45)',
              }}
            >
              Hand-picked experiences from passionate local guides. Every journey tells a story worth living.
            </p>

            <div className="flex items-center gap-4 animate-fade-up stagger-4">
              <Link href="/auth/register" className="btn-gold">
                Start Exploring <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/create"
                className="btn-outline"
                style={{
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.7)',
                  background: 'rgba(255,255,255,0.08)',
                }}
              >
                Share an Experience
              </Link>
            </div>

            {/* Stats */}
            <div
              className="flex items-center gap-10 mt-12 pt-10 border-t animate-fade-up stagger-5"
              style={{ borderColor: 'rgba(255,255,255,0.45)' }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p
                    className="font-display text-2xl font-bold"
                    style={{
                      color: '#ffffff',
                      textShadow: '0 2px 8px rgba(0,0,0,0.35)',
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="mt-0.5 uppercase tracking-[0.2em] text-xs"
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 600,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none hidden lg:block"
          style={{
            background: 'radial-gradient(ellipse 70% 80% at 70% 40%, rgba(201,151,58,0.15) 0%, transparent 10%)',
          }}
        />
      </section>

      {/* ── Feed ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <SearchBar onSearch={setSearch} onCategoryChange={setCategory} activeCategory={category} />
        </div>

        {/* Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="section-label">
              {total} experience{total !== 1 ? 's' : ''} {search ? `for "${search}"` : 'worldwide'}
            </p>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                <div className="skeleton h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-5xl mb-4" style={{ color: 'var(--border)' }}>✦</p>
            <h3 className="font-display text-xl mb-2" style={{ color: 'var(--ink-soft)' }}>No experiences found</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Try adjusting your search or explore a different category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((listing, i) => (
                <div
                  key={listing._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(i % 8) * 0.05}s`, opacity: 0 }}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>

            {page <= totalPages && (
              <div className="flex justify-center mt-12">
                <button onClick={() => fetchListings(false)} disabled={loadingMore} className="btn-outline gap-3">
                  {loadingMore
                    ? <><FiLoader className="w-4 h-4 animate-spin" /> Loading...</>
                    : 'Load More Experiences'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}