'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@/types/video';
import { Star, Eye, Calendar } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const formatViews = (views?: number) => {
    if (!views) return '0';
    return views.toLocaleString('fa-IR');
  };

  return (
    <Link
      href={`/program/${video.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail/Poster - You can replace with actual video thumbnails */}
      <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center p-4">
          <h3 className="text-4xl font-bold mb-2">#{video.programNumber}</h3>
          <p className="text-sm opacity-90">برنامه گنج حضور</p>
        </div>
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {video.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {video.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {video.metadata.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{video.metadata.rating.toFixed(1)}</span>
            </div>
          )}
          
          {video.metadata.views && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{formatViews(video.metadata.views)}</span>
            </div>
          )}
          
          {video.metadata.date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(video.metadata.date)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {video.metadata.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {video.metadata.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
