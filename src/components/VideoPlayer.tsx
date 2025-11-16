'use client';

import { useState } from 'react';
import { VideoUrls } from '@/types/video';
import { Download, Settings } from 'lucide-react';

interface VideoPlayerProps {
  videoUrls: VideoUrls;
  title: string;
  programNumber: number;
}

export default function VideoPlayer({ videoUrls, title, programNumber }: VideoPlayerProps) {
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const currentUrl = quality === 'high' ? videoUrls.highQuality : videoUrls.lowQuality;

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Video Player */}
      <video
        key={currentUrl}
        controls
        className="w-full aspect-video"
        poster="/video-placeholder.jpg"
      >
        <source src={currentUrl} type="video/mp4" />
        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
      </video>

      {/* Controls Overlay */}
      <div className="absolute bottom-16 right-4 flex gap-2">
        {/* Quality Selector */}
        <div className="relative">
          <button
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="p-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-lg backdrop-blur-sm transition-all"
            title="کیفیت ویدیو"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {showQualityMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-xl overflow-hidden min-w-32">
              <button
                onClick={() => {
                  setQuality('high');
                  setShowQualityMenu(false);
                }}
                className={`w-full px-4 py-2 text-right hover:bg-gray-800 transition-colors ${
                  quality === 'high' ? 'bg-purple-600 text-white' : 'text-gray-300'
                }`}
              >
                کیفیت بالا
              </button>
              <button
                onClick={() => {
                  setQuality('low');
                  setShowQualityMenu(false);
                }}
                className={`w-full px-4 py-2 text-right hover:bg-gray-800 transition-colors ${
                  quality === 'low' ? 'bg-purple-600 text-white' : 'text-gray-300'
                }`}
              >
                کیفیت پایین
              </button>
            </div>
          )}
        </div>

        {/* Download Button */}
        <a
          href={currentUrl}
          download={`ganj-hozour-${programNumber}-${quality}.mp4`}
          className="p-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-lg backdrop-blur-sm transition-all"
          title="دانلود ویدیو"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>

      {/* Video Info Overlay */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-3 text-white">
          <p className="text-sm opacity-75">برنامه #{programNumber}</p>
          <h2 className="font-semibold">{title}</h2>
        </div>
      </div>
    </div>
  );
}
