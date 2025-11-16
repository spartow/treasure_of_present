import { NextResponse } from 'next/server';
import type { Video, VideoListResponse } from '@/types/video';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');
  const sortBy = searchParams.get('sortBy') || 'programNumber';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const query = searchParams.get('query') || '';

  try {
    // TODO: Replace with actual Strapi API call
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    
    const response = await fetch(
      `${strapiUrl}/api/videos?` +
      `pagination[page]=${page}&` +
      `pagination[pageSize]=${pageSize}&` +
      `sort=${sortBy}:${sortOrder}` +
      (query ? `&filters[title][$contains]=${encodeURIComponent(query)}` : ''),
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Strapi');
    }

    const data = await response.json();
    
    // Transform Strapi data to our format
    const videos: Video[] = data.data.map((item: any) => ({
      programNumber: item.attributes.programNumber,
      slug: item.attributes.slug,
      title: item.attributes.title,
      description: item.attributes.description,
      transcript: item.attributes.transcript,
      videoUrls: {
        highQuality: item.attributes.videoUrls.highQuality,
        lowQuality: item.attributes.videoUrls.lowQuality,
      },
      metadata: {
        rating: item.attributes.metadata.rating,
        views: item.attributes.metadata.views,
        date: item.attributes.metadata.date,
        tags: item.attributes.metadata.tags || [],
        pdfLinks: item.attributes.metadata.pdfLinks || [],
      },
      ids: {
        videoId: item.attributes.ids.videoId,
        telegramMessageId: item.attributes.ids.telegramMessageId,
      },
    }));

    const responseData: VideoListResponse = {
      videos,
      total: data.meta.pagination.total,
      page: data.meta.pagination.page,
      pageSize: data.meta.pagination.pageSize,
      totalPages: data.meta.pagination.pageCount,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching videos:', error);
    
    // Return empty response for development
    return NextResponse.json({
      videos: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 0,
    });
  }
}
