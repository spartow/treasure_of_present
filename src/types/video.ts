/**
 * Type definitions for Ganj e Hozour video content
 */

export interface VideoUrls {
  highQuality: string;
  lowQuality: string;
}

export interface PdfLink {
  url: string;
  description: string;
}

export interface VideoMetadata {
  rating?: number;
  views?: number;
  date?: string;
  tags: string[];
  pdfLinks: PdfLink[];
}

export interface VideoIds {
  videoId: string;
  telegramMessageId?: number;
}

export interface Transcript {
  messageId?: number;
  date?: string;
  text: string;
  views?: number;
  forwards?: number;
}

export interface Video {
  programNumber: number;
  slug: string;
  title: string;
  description: string;
  transcript?: string;
  videoUrls: VideoUrls;
  metadata: VideoMetadata;
  ids: VideoIds;
}

export interface VideoListResponse {
  videos: Video[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface VideoSearchParams {
  query?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'date' | 'rating' | 'views' | 'programNumber';
  sortOrder?: 'asc' | 'desc';
}
