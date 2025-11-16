export interface Episode {
  episodeNumber: number;
  title: string;
  videoUrl: string;
  date: string | null;
  category: string;
  thumbnail: string | null;
  description?: string;
}
