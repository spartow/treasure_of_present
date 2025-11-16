import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import { Video } from '@/types/video';
import { FileText, Download, Tag, Calendar, Star, Eye } from 'lucide-react';
import Link from 'next/link';

async function getVideo(slug: string): Promise<Video | null> {
  try {
    // TODO: Replace with actual API call to Strapi
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/videos/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const video = await getVideo(params.slug);
  
  if (!video) {
    return {
      title: 'برنامه یافت نشد',
    };
  }

  return {
    title: video.title,
    description: video.description.slice(0, 160),
    openGraph: {
      title: video.title,
      description: video.description,
      type: 'video.other',
      videos: [
        {
          url: video.videoUrls.highQuality,
          width: 1920,
          height: 1080,
        },
      ],
    },
  };
}

export default async function VideoPage({ params }: { params: { slug: string } }) {
  const video = await getVideo(params.slug);

  if (!video) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors inline-flex items-center gap-2"
          >
            ← بازگشت به صفحه اصلی
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Video Player */}
          <div className="mb-8">
            <VideoPlayer
              videoUrls={video.videoUrls}
              title={video.title}
              programNumber={video.programNumber}
            />
          </div>

          {/* Video Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" dir="rtl">
                {video.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(video.metadata.date)}</span>
                </div>
                {video.metadata.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{video.metadata.rating.toFixed(1)} / 5</span>
                  </div>
                )}
                {video.metadata.views && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{video.metadata.views.toLocaleString('fa-IR')} بازدید</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  توضیحات
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed" dir="rtl">
                  {video.description}
                </p>
              </div>

              {/* Transcript */}
              {video.transcript && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    متن برنامه
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed" dir="rtl">
                    {video.transcript}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tags */}
              {video.metadata.tags.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    برچسب‌ها
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {video.metadata.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Links */}
              {video.metadata.pdfLinks.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    فایل‌های PDF
                  </h3>
                  <div className="space-y-2">
                    {video.metadata.pdfLinks.map((pdf, index) => (
                      <a
                        key={index}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
                      >
                        <Download className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300" dir="rtl">
                          {pdf.description}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Program Number */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-lg p-6 text-center">
                <p className="text-sm opacity-90 mb-2">شماره برنامه</p>
                <p className="text-4xl font-bold">#{video.programNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="mb-2">© 2025 Parviz Shahbazi. All rights reserved.</p>
          <p className="text-sm">تمامی حقوق این سایت محفوظ است</p>
        </div>
      </footer>
    </div>
  );
}
