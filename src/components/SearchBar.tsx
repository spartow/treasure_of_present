'use client';

import { useState, useCallback } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { VideoSearchParams } from '@/types/video';

interface SearchBarProps {
  onSearch: (params: VideoSearchParams) => void;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<VideoSearchParams['sortBy']>('programNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSearch = useCallback(() => {
    onSearch({
      query,
      sortBy,
      sortOrder,
    });
  }, [query, sortBy, sortOrder, onSearch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch({
      query: '',
      sortBy,
      sortOrder,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="جستجوی برنامه‌ها، عناوین، یا موضوعات..."
            className="w-full px-4 py-3 pr-12 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
            dir="rtl"
          />
          
          {/* Search Icon */}
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          {/* Clear Button */}
          {query && (
            <button
              onClick={clearSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-lg border transition-colors ${
            showFilters
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          title="فیلترها"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          جستجو
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-right">
            مرتب‌سازی
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort By */}
            <div className="text-right">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                مرتب‌سازی بر اساس
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as VideoSearchParams['sortBy'])}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-right"
                dir="rtl"
              >
                <option value="programNumber">شماره برنامه</option>
                <option value="date">تاریخ</option>
                <option value="rating">امتیاز</option>
                <option value="views">بازدید</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="text-right">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                ترتیب
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-right"
                dir="rtl"
              >
                <option value="desc">نزولی (جدیدترین)</option>
                <option value="asc">صعودی (قدیمی‌ترین)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
