import { notFound } from 'next/navigation';
import { getEpisodeByNumber } from '@/lib/episodes';
import EpisodeCard from '@/components/EpisodeCard';
import { getEpisodesInRange } from '@/lib/episodes';

export default function EpisodePage({
  params,
}: {
  params: { id: string };
}) {
  const episodeNumber = parseInt(params.id, 10);
  const episode = getEpisodeByNumber(episodeNumber);
  
  if (!episode) {
    notFound();
  }

  // Get related episodes (previous and next)
  const currentIndex = getEpisodesInRange(1, 1000).findIndex(
    (ep) => ep.episodeNumber === episodeNumber
  );
  
  const previousEpisode = currentIndex > 0 
    ? getEpisodesInRange(1, 1000)[currentIndex - 1] 
    : null;
  const nextEpisode = currentIndex < getEpisodesInRange(1, 1000).length - 1 
    ? getEpisodesInRange(1, 1000)[currentIndex + 1] 
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          {episode.title}
        </h1>
        
        <div className="mb-8 overflow-hidden rounded-lg bg-black">
          <video
            className="h-full w-full"
            controls
            autoPlay
            poster={episode.thumbnail || undefined}
          >
            <source src={episode.videoUrl} type="video/mp4" />
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
          </video>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row">
          <div className="flex-1">
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              توضیحات
            </h2>
            <div className="prose max-w-none text-gray-700 dark:text-gray-300">
              {episode.description ? (
                <p>{episode.description}</p>
              ) : (
                <p className="text-gray-500 italic">توضیحاتی برای این ویدیو موجود نیست.</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-4 sm:w-64">
            {previousEpisode && (
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">قسمت قبلی</h3>
                <a
                  href={`/episode/${previousEpisode.episodeNumber}`}
                  className="block truncate text-blue-600 hover:underline dark:text-blue-400"
                >
                  {previousEpisode.title}
                </a>
              </div>
            )}
            
            {nextEpisode && (
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">قسمت بعدی</h3>
                <a
                  href={`/episode/${nextEpisode.episodeNumber}`}
                  className="block truncate text-blue-600 hover:underline dark:text-blue-400"
                >
                  {nextEpisode.title}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            قسمت‌های مشابه
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {getEpisodesInRange(
              Math.max(1, episodeNumber - 4),
              episodeNumber + 3
            )
              .filter((ep) => ep.episodeNumber !== episodeNumber)
              .slice(0, 4)
              .map((relatedEpisode) => (
                <EpisodeCard key={relatedEpisode.episodeNumber} episode={relatedEpisode} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all episodes
export async function generateStaticParams() {
  const episodes = getEpisodesInRange(1, 1000);
  return episodes.map((episode) => ({
    id: episode.episodeNumber.toString(),
  }));
}
