'use client';
import { useState, useEffect, useCallback } from 'react';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import { getListings } from '@/lib/api';
import { FiLoader, FiCompass } from 'react-icons/fi';

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

      setListings(reset ? newListings : [...listings, ...newListings]);
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
  }, [search, category, page, listings]);

  useEffect(() => {
    fetchListings(true);
  }, [search, category]);

  const handleSearch = (q) => { setSearch(q); setPage(1); };
  const handleCategory = (c) => { setCategory(c); setPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <FiCompass className="w-4 h-4" />
          Discover Unique Experiences
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Your Next Adventure Awaits
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Explore hand-picked travel experiences from passionate local guides around the world.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} onCategoryChange={handleCategory} activeCategory={category} />
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">{total} experience{total !== 1 ? 's' : ''} found</p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <FiCompass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-500 mb-1">No experiences found</h3>
          <p className="text-gray-400 text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>

          {/* Load More */}
          {page <= totalPages && (
            <div className="text-center mt-10">
              <button
                onClick={() => fetchListings(false)}
                disabled={loadingMore}
                className="btn-secondary"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <FiLoader className="w-4 h-4 animate-spin" /> Loading...
                  </span>
                ) : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
