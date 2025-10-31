const YOUTUBE_API_KEY = 'AIzaSyB8Qjs5VVs4152sKmzhj6h4MvAbMLw7KX4';
// const YOUTUBE_API_KEY = 'AIzaSyDHwpfHrZMtxZ_Ql7QUxJpX7hnXMoIBxqw';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  durationSeconds?: number;
}

export interface SearchResponse {
  songs: Song[];
  nextPageToken?: string;
}

export async function searchYouTube(query: string, pageToken?: string): Promise<SearchResponse> {
  try {
    let url = `${YOUTUBE_API_BASE}/search?part=snippet&type=video&videoCategoryId=10&maxResults=20&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
    
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    
    const searchResponse = await fetch(url);
    
    if (!searchResponse.ok) {
      throw new Error('Failed to search YouTube');
    }

    const searchData = await searchResponse.json();
    
    // Extract video IDs for duration lookup
    const videoIds = searchData.items
      .filter((item: any) => item.id.videoId && item.snippet)
      .map((item: any) => item.id.videoId)
      .join(',');

    if (!videoIds) {
      return { songs: [], nextPageToken: searchData.nextPageToken };
    }

    // Get video durations
    const detailsResponse = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch video details');
    }

    const detailsData = await detailsResponse.json();
    const durationMap = new Map();
    
    detailsData.items.forEach((item: any) => {
      durationMap.set(item.id, item.contentDetails.duration);
    });

    const songs = searchData.items
      .filter((item: any) => item.id.videoId && item.snippet)
      .map((item: any) => {
        const duration = durationMap.get(item.id.videoId);
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
          duration: formatDuration(duration),
          durationSeconds: parseDurationToSeconds(duration),
        };
      });

    return {
      songs,
      nextPageToken: searchData.nextPageToken
    };
  } catch (error) {
    console.error('YouTube search error:', error);
    return { songs: [] };
  }
}

function formatDuration(duration: string): string {
  if (!duration) return '0:00';
  
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  let totalSeconds = 0;
  if (hours) totalSeconds += parseInt(hours) * 3600;
  if (minutes) totalSeconds += parseInt(minutes) * 60;
  if (seconds) totalSeconds += parseInt(seconds);
  
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  
  if (hours) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function parseDurationToSeconds(duration: string): number {
  if (!duration) return 0;
  
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  let totalSeconds = 0;
  if (hours) totalSeconds += parseInt(hours) * 3600;
  if (minutes) totalSeconds += parseInt(minutes) * 60;
  if (seconds) totalSeconds += parseInt(seconds);
  
  return totalSeconds;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0`;
}