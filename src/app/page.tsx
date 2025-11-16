'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Phone, Mail, ExternalLink, ChevronRight, Loader2, Menu, X as XIcon } from 'lucide-react';
import { Episode } from '../types/episode';
import { getEpisodesInRange, getTotalEpisodes } from '@/lib/episodes';
import EpisodeCard from '@/components/EpisodeCard';
import { URL_MAPPING, getVideoCategoryUrl, getAudioCategoryUrl, getSpecialCollectionUrl } from '@/lib/urlMapping';

export default function Home() {
  const audioCategories = [
    'تصویری حجم پایین', 'صوتی حجم پایین', 'پیام‌های معنوی', 'پیغام عشق',
    'کودکان عشق', 'جوانان عشق', 'گنجینه عشق', 'چراغ عشق'
  ] as const;

  const videoRanges = [
    { label: '1-100', start: 1, end: 100 },
    { label: '101-200', start: 101, end: 200 },
    { label: '201-300', start: 201, end: 300 },
    { label: '301-400', start: 301, end: 400 },
    { label: '401-500', start: 401, end: 500 },
    { label: '501-600', start: 501, end: 600 },
    { label: '601-700', start: 601, end: 700 },
    { label: '701-800', start: 701, end: 800 },
    { label: '801-900', start: 801, end: 900 },
    { label: '901-1000', start: 901, end: 1000 },
    { label: '1001-1100', start: 1001, end: 1100 },
  ];

  const [currentRange, setCurrentRange] = useState(videoRanges[0]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load episodes for the current range
  useEffect(() => {
    const loadEpisodes = () => {
      setIsLoading(true);
      try {
        const eps = getEpisodesInRange(currentRange.start, currentRange.end);
        setEpisodes(eps);
      } catch (error) {
        console.error('Error loading episodes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisodes();
  }, [currentRange]);

  // Filter episodes based on search query
  const filteredEpisodes = episodes.filter(episode => 
    episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    episode.episodeNumber.toString().includes(searchQuery)
  );

  const totalEpisodes = getTotalEpisodes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
        }}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(45deg, transparent 49%, rgba(59, 130, 246, 0.03) 50%, transparent 51%)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Floating Orbs - Hidden on mobile */}
      <div className="hidden lg:block absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="hidden lg:block absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="hidden lg:block absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10">
      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3">
          <div className="flex items-center justify-between relative w-full">
            {/* Desktop Navigation - Hidden on mobile, show on md and up */}
            <div className="desktop-nav hidden md:flex items-center gap-3 lg:gap-4 xl:gap-8 overflow-x-auto" dir="rtl">
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap flex-shrink-0">خانه</Link>
              <a href={URL_MAPPING.support} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">حمایت</a>
              <a href={URL_MAPPING.links} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">لینک‌ها</a>
              <a href={URL_MAPPING.contact} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">تماس</a>
              <a href={URL_MAPPING.payamManavi} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">پیام‌های معنوی</a>
              <a href={URL_MAPPING.peighamEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">پیغام عشق</a>
              <a href={URL_MAPPING.koodakanEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">کودکان عشق</a>
              <a href={URL_MAPPING.javaananEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">جوانان عشق</a>
              <a href={URL_MAPPING.cheraghEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">چراغ عشق</a>
              <a href={URL_MAPPING.summaries} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">خلاصه</a>
              <a href={URL_MAPPING.ganjinehEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm whitespace-nowrap flex-shrink-0">گنجینه عشق</a>
            </div>
            
            {/* Mobile Menu Button - Show on mobile, hide on md and up */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="mobile-menu-btn flex md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 z-10 flex-shrink-0"
              aria-label="Menu"
            >
              {showMobileMenu ? <XIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
              <a 
                href={URL_MAPPING.liveTV}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 sm:gap-1 md:gap-2 bg-red-600 hover:bg-red-700 text-white px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full transition-colors shadow-lg text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                <span className="font-medium hidden sm:inline">Live TV</span>
              </a>
              <a 
                href={URL_MAPPING.support}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 md:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-4 py-1 md:py-2 rounded-full transition-colors text-xs md:text-sm whitespace-nowrap"
              >
                <span className="font-medium">حمایت</span>
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4" dir="rtl">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700">خانه</Link>
                <a href={URL_MAPPING.support} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">حمایت از گنج حضور</a>
                <a href={URL_MAPPING.links} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">لینک‌ها</a>
                <a href={URL_MAPPING.contact} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">تماس با ما</a>
                <a href={URL_MAPPING.payamManavi} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">پیام‌های معنوی</a>
                <a href={URL_MAPPING.peighamEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">پیغام عشق</a>
                <a href={URL_MAPPING.koodakanEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">کودکان عشق</a>
                <a href={URL_MAPPING.javaananEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">جوانان عشق</a>
                <a href={URL_MAPPING.cheraghEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">چراغ عشق</a>
                <a href={URL_MAPPING.summaries} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">خلاصه برنامه‌ها</a>
                <a href={URL_MAPPING.ganjinehEshgh} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">گنجینه عشق</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Bar */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 lg:py-4">
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 w-full max-w-4xl mx-auto">
            <div className="p-1 sm:p-1.5 md:p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md sm:rounded-lg md:rounded-xl shadow-lg flex-shrink-0">
              <Search className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-3 lg:py-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 sm:border-2 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 sm:focus:ring-2 md:focus:ring-4 focus:ring-blue-500/20 text-gray-900 dark:text-white text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all duration-300"
              dir="rtl"
            />
            <button className="px-2 sm:px-3 md:px-4 lg:px-8 py-1.5 sm:py-2 md:py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-[10px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap flex-shrink-0">
              <span className="hidden sm:inline">Search</span>
              <span className="sm:hidden text-xs">🔍</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 sm:mb-12 leading-tight px-2 sm:px-4" dir="rtl" style={{ 
              fontFamily: 'Vazirmatn, sans-serif',
              letterSpacing: '0.02em',
              wordSpacing: '0.1em'
            }}>
              گنج حضور
            </h1>
            
            {/* Featured Program Card */}
            <div className="max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-8 text-white">
                <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">برنامه ۱۰۴۲</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" dir="rtl">
                  جدیدترین برنامه گنج حضور
                </h2>
                <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
                  برنامه ویژه پیام‌های تلفنی شنوندگان
                </p>
              </div>
              <div className="p-4 sm:p-8">
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-4 sm:mb-8">
                  تاریخ اجرا: ۱۶ نوامبر ۲۰۲۵ - ۲۳ آبان ۱۴۰۴
                </p>
                <a
                  href="https://www.parvizshahbazi.com/ganj_videos/musicvideo.php?vid=fb4452476"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>نمایش برنامه</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8" dir="rtl">
            
            {/* Left Sidebar */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Special Program Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4">
                  <h3 className="font-bold text-gray-900 text-center">برنامه ویژه تلفنی</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                    جدیدترین برنامه ویژه پیام‌های تلفنی شنوندگان
                  </p>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center mb-4">
                    <p className="text-xs text-gray-500 mb-1">تاریخ اجرا:</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">۱۶ نوامبر ۲۰۲۵</p>
                    <p className="text-xs text-gray-500">۲۳ آبان ۱۴۰۴</p>
                  </div>
                  <a
                    href="https://www.parvizshahbazi.com/ganj_videos/category.php?cat=Phone-Call"
                    onClick={(e) => {
                      // Try using singular Phone-Call instead of Phone-Calls
                      // This might bypass the mobile redirect
                      e.preventDefault();
                      const url = 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=Phone-Call';
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-bold text-sm text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    مشاهده برنامه‌های تلفنی
                  </a>
                </div>
              </div>

              {/* Classes Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <h3 className="font-bold text-white text-center">کلاس‌های حضوری</h3>
                </div>
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-3">
                    <Phone className="w-5 h-5" />
                    <span className="font-bold text-lg">001 438 686 7580</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    کلاس‌های حضوری و آنلاین آموزش زبان فارسی برای کودکان و بزرگسالان در مرکز مولانای گنج حضور
                  </p>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                  <h3 className="font-bold text-white text-center">حمایت از گنج حضور</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center leading-relaxed">
                    برای حمایت از برنامه‌های گنج حضور می‌توانید از طریق PayPal یا کارت اعتباری کمک کنید.
                  </p>
                  <a
                    href={URL_MAPPING.support}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-bold text-sm text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    اطلاعات حمایت
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-6">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 md:p-8 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center">
                    برنامه‌های صوتی و تصویری گنج حضور به ترتیب شماره
                  </h2>
                  <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
                    کلیک بر روی شماره دلخواه شما برای شنیدن، دانلود، مطالعه متن شنیدن، نظر دادن و امکانات دیگر
                  </p>
                </div>
                
                <div className="p-4 sm:p-6 md:p-8">
                  {/* Video & Audio Ranges Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8" dir="rtl">
                    {/* Video column */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
                        برنامه‌های تصویری گنج حضور به ترتیب شماره
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {videoRanges.map((range) => (
                          <a
                            key={range.label}
                            href={getVideoCategoryUrl(range.label)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                            <span className="relative">{range.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Audio column */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
                        برنامه‌های صوتی گنج حضور به ترتیب شماره
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {videoRanges.map((range, index) => (
                          <a
                            key={`audio-${range.label}`}
                            href={getAudioCategoryUrl(range.label)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                            <span className="relative">{range.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Special Collections */}
                  <div className="mt-6 sm:mt-8 md:mt-10">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
                      مجموعه‌های ویژه
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4" dir="rtl">
                      {audioCategories.map((category, index) => (
                        <a
                          key={category}
                          href={getSpecialCollectionUrl(category)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-center">{category}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Information Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                  <h3 className="font-bold text-white text-center">اطلاعیه واژنامه</h3>
                </div>
                  <div className="p-6">
                  <a href="https://www.vajehyab.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-bold block mb-3 text-center">
                    اطلاعیه واژنامه
                  </a>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed text-center">
                    رضا یا داده پدیدر هر حدیث کرد یکجاست کنز تو من و تو در اختیار یکجاست
                  </p>
                  <p className="text-xs text-gray-500 text-center">حافظ -غزلیات- شماره ۲۷</p>
                </div>
              </div>

              {/* Poet Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                  <h3 className="font-bold text-white text-center">شعر روز</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-center">
                    بشنو این نکته که خود را فراز قند کندی جنون‌وار به طلب روی پیشکش کندی
                  </p>
                  <p className="text-xs text-gray-500 text-center">حافظ -غزلیات- شماره ۳۸۱</p>
                </div>
              </div>

              {/* Poets Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4">
                  <h3 className="font-bold text-white text-center">از اشعار شاعران ایرانی</h3>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    در این بخش علاقه مندان شعر فارسی می‌توانند با شاعران سراسر جهان آشنا شوند.
                  </p>
                  <a 
                    href="https://www.ganjnama.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>www.GANJINAMA.com</span>
                  </a>
                </div>
              </div>

              {/* Download Section */}
              <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
                <div className="p-6 text-gray-900">
                  <h3 className="text-xl font-black mb-4 text-center">دانلود اپلیکیشن</h3>
                  <p className="text-sm mb-6 opacity-90 text-center leading-relaxed">
                    شما می‌توانید تمامی برنامه‌های گنج حضور را از طریق اپلیکیشن دریافت نموده به راحتی به یک کلیک در گوشی خود ذخیره داشته باشید.
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="https://play.google.com/store/apps/details?id=com.goodbarber.ganjehozour2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center"
                    >
                      دانلود اپلیکیشن برای اندروید
                    </a>
                    <a 
                      href="https://apps.apple.com/us/app/ganje-hozour-2/id979974590?uo=42"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center"
                    >
                      دانلود اپلیکیشن برای آیفون
                    </a>
                  </div>
                </div>
              </div>

              {/* Visitor Counter - sidebar */}
              <div
                className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 rounded-2xl shadow-md border border-amber-100/80 px-8 py-5 w-full max-w-xs md:max-w-sm flex flex-col items-start gap-3 text-left mx-auto"
                dir="ltr"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Today visitors:</span>
                  <span className="text-2xl font-black text-amber-700">506</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Total: 125,847</span>
                  <span>Online: 12</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/50 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-right" dir="rtl">
            {/* Frequencies - right */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">پخش فرکانس شبکه‌های گنج حضور</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold">گنج حضور ۱</p>
                <p>Frequency: 11766</p>
                <p>Symbol Rate: 27500</p>
                <p>FEC: 3/6</p>
              </div>
            </div>

            {/* Contact - middle */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">تماس با ما</h3>
              <div className="space-y-2 text-sm">
                <a href="mailto:parviz4762@mac.com" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <Mail className="w-4 h-4" />
                  <span>parviz4762@mac.com</span>
                </a>
                <a href="mailto:support@parvizshahbazi.com" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <Mail className="w-4 h-4" />
                  <span>support@parvizshahbazi.com</span>
                </a>
              </div>
            </div>

            {/* Address - left */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-right">آدرس</h3>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 text-left md:text-left"
                dir="ltr"
              >
                Ganj e Hozour TV and Radio broadcast from Los Angeles California<br/>
                P.O.BOX 745 Woodland Hills, CA<br/>
                USA 91365<br/>
                parvizshahbazi.com<br/>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
            <div className="text-center">
              <p className="text-xs text-gray-500">2025 Parviz Shahbazi All rights reserved © </p>
              <p className="text-xs text-gray-400 mt-1">Time base: Pacific Daylight Time</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
