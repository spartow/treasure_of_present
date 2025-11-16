import episodesData from '../../data/episodes.json';
import { Episode } from '@/types/episode';

// Using Episode interface from types/episode

// Sort episodes by episode number in descending order (newest first)
// Handle case where episodesData might be empty or undefined
const allEpisodes: Episode[] = Array.isArray(episodesData) 
  ? (episodesData as Episode[]).sort((a, b) => b.episodeNumber - a.episodeNumber)
  : [];

export function getEpisodesInRange(start: number, end: number): Episode[] {
  return allEpisodes.filter(
    (episode) => episode.episodeNumber >= start && episode.episodeNumber <= end
  );
}

export function getEpisodeByNumber(episodeNumber: number): Episode | undefined {
  return allEpisodes.find((ep) => ep.episodeNumber === episodeNumber);
}

export function getTotalEpisodes(): number {
  return allEpisodes.length;
}

export function getLatestEpisodes(limit: number = 10): Episode[] {
  return allEpisodes.slice(0, limit);
}
