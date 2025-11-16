import Link from 'next/link';
import { Episode } from '@/types/episode';

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link 
      href={`/episode/${episode.episodeNumber}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800"
    >
      <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-700">
        {episode.thumbnail ? (
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">
          قسمت {episode.episodeNumber}
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-2 dark:text-white">
          {episode.title}
        </h3>
        {episode.date && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(episode.date).toLocaleDateString('fa-IR')}
          </p>
        )}
      </div>
    </Link>
  );
}
