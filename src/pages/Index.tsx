'use client';

import { useState, useEffect, useRef } from 'react';
import { Music2, Loader2 } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { SongCard } from '@/components/SongCard';
import { PlayerBar } from '@/components/PlayerBar';
import { searchYouTube, Song, SearchResponse } from '@/lib/youtube';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [currentQuery, setCurrentQuery] = useState('');
  
  const playerRef = useRef<any>(null);
  const { toast } = useToast();

  // Load recent songs and search query from localStorage on mount
  useEffect(() => {
    const recentSongs = localStorage.getItem('madify_recent');
    const savedQuery = localStorage.getItem('madify_search_query');
    
    if (recentSongs) {
      const parsed = JSON.parse(recentSongs);
      setSongs(parsed);
      setPlaylist(parsed);
    }
    
    if (savedQuery) {
      setCurrentQuery(savedQuery);
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setCurrentQuery(query);
    setNextPageToken(undefined);
    
    try {
      const response: SearchResponse = await searchYouTube(query);
      if (response.songs.length > 0) {
        setSongs(response.songs);
        setPlaylist(response.songs);
        setNextPageToken(response.nextPageToken);
        // Save to localStorage
        localStorage.setItem('madify_recent', JSON.stringify(response.songs));
        localStorage.setItem('madify_search_query', query);
      } else {
        toast({
          title: "No results found",
          description: "Try a different search term",
          variant: "destructive",
        });
        setSongs([]);
        setPlaylist([]);
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextPageToken || !currentQuery) return;
    
    setIsLoadingMore(true);
    try {
      const response: SearchResponse = await searchYouTube(currentQuery, nextPageToken);
      if (response.songs.length > 0) {
        setSongs(prev => [...prev, ...response.songs]);
        setPlaylist(prev => [...prev, ...response.songs]);
        setNextPageToken(response.nextPageToken);
        
        // Update localStorage with combined results
        const combinedSongs = [...songs, ...response.songs];
        localStorage.setItem('madify_recent', JSON.stringify(combinedSongs));
      }
    } catch (error) {
      toast({
        title: "Failed to load more songs",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handlePlaySong = async (song: Song, index: number) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    
    console.log('Moving to next song:', {
      currentIndex,
      nextIndex,
      playlistLength: playlist.length,
    });
    
    // If we're back at the first song, stop playback (end of playlist)
    if (nextIndex === 0) {
      console.log('End of playlist, stopping');
      setIsPlaying(false);
      setCurrentIndex(0);
      setCurrentSong(playlist[0]);
      return;
    }
    
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    
    console.log('Moving to previous song:', {
      currentIndex,
      prevIndex,
      playlistLength: playlist.length
    });
    
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo Section */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                <span className="bg-gradient-to-r from-primary/50 to-primary/90 bg-clip-text text-transparent">
                  Madify
                </span>
              </h1>
              <p className="text-xs text-muted-foreground -mt-1 font-medium">Music Player</p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <SearchBar onSearch={handleSearch} initialQuery={currentQuery} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-pulse-glow rounded-full h-16 w-16 bg-red-500/20 mx-auto mb-4" />
              <p className="text-muted-foreground">Searching...</p>
            </div>
          </div>
        ) : songs.length > 0 ? (
          <>
            <div className="space-y-2 mb-6">
              {songs.map((song, index) => (
                <SongCard
                  key={`${song.id}-${index}`}
                  song={song}
                  isPlaying={currentSong?.id === song.id && isPlaying}
                  onPlay={() => handlePlaySong(song, index)}
                />
              ))}
            </div>
            
            {/* Load More Button */}
            {nextPageToken && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Songs'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music2 className="h-24 w-24 text-muted-foreground/20 mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Start Your Vibe
            </h2>
            <p className="text-muted-foreground max-w-md">
              Search for your favorite songs, artists, or albums to begin your musical journey
            </p>
          </div>
        )}
      </main>

      {/* Player Bar */}
      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onPlayerReady={handlePlayerReady}
        playlist={playlist}
        currentIndex={currentIndex}
      />
    </div>
  );
};

export default Index;