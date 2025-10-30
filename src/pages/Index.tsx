"use client";

import { useState, useEffect, useRef } from "react";
import { Music4Icon, Loader2 } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { SongCard } from "@/components/SongCard";
import { PlayerBar } from "@/components/PlayerBar";
import { searchYouTube, Song, SearchResponse } from "@/lib/youtube";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [currentQuery, setCurrentQuery] = useState("");
  const [isLooping, setIsLooping] = useState(false);
  const handleToggleLoop = () => setIsLooping((prev) => !prev);

  const playerRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const recentSongs = localStorage.getItem("madify_recent");
    const savedQuery = localStorage.getItem("madify_search_query");

    if (recentSongs) {
      const parsed = JSON.parse(recentSongs);
      setSongs(parsed);
      setPlaylist(parsed);
      setCurrentSong(parsed[0] || null);
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
        localStorage.setItem("madify_recent", JSON.stringify(response.songs));
        localStorage.setItem("madify_search_query", query);
      } else {
        toast({
          title: "No results found",
          description: "Try a different search term",
          variant: "destructive",
        });
        setSongs([]);
        setPlaylist([]);
      }
    } catch {
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
      const response: SearchResponse = await searchYouTube(
        currentQuery,
        nextPageToken
      );
      if (response.songs.length > 0) {
        setSongs((prev) => [...prev, ...response.songs]);
        setPlaylist((prev) => [...prev, ...response.songs]);
        setNextPageToken(response.nextPageToken);
        const combinedSongs = [...songs, ...response.songs];
        localStorage.setItem("madify_recent", JSON.stringify(combinedSongs));
      }
    } catch {
      toast({
        title: "Failed to load more songs",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handlePlaySong = (song: Song, index: number) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (playlist.length === 0) return;
    const prevIndex =
      currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
  };

  // Ensure autoplay works after reload
  useEffect(() => {
    if (!playerRef.current || !currentSong) return;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [playerRef.current, currentSong, isPlaying]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              <span className="bg-gradient-to-r from-primary/50 to-primary/90 bg-clip-text text-transparent">
                Madify
              </span>
            </h1>
            <p className="text-xs text-muted-foreground -mt-1 font-medium">
              Music Player
            </p>
          </div>

          <div className="flex-1 max-w-2xl">
            <SearchBar onSearch={handleSearch} initialQuery={currentQuery} />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-pulse-glow rounded-full h-16 w-16 bg-green-500/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Searching...</p>
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
                    "Load More Songs"
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music4Icon className="h-24 w-24 text-muted-foreground/20 mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Start Your Vibe
            </h2>
            <p className="text-muted-foreground">
              Search for your favorite songs or artists to begin your musical
              journey
            </p>
          </div>
        )}
      </main>

      <PlayerBar
        currentSong={currentSong}
        isLooping={isLooping}
        onToggleLoop={handleToggleLoop}
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
