'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { Song } from '@/lib/youtube';

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPlayerReady: (player: any) => void;
  playlist: Song[];
  currentIndex: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function PlayerBar({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onPlayerReady,
  playlist,
  currentIndex,
}: PlayerBarProps) {
  const playerRef = useRef<any>(null);
  const onNextRef = useRef(onNext);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // keep onNext always up to date
  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  // Format time helper
  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        setIsAPIReady(true);
      };
    } else {
      setIsAPIReady(true);
    }
  }, []);

  // Initialize YouTube player only once
  useEffect(() => {
    if (isAPIReady && !playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
            setIsPlayerReady(true);
            onPlayerReady(event.target);
          },
          onStateChange: (event: any) => {
            switch (event.data) {
              case window.YT.PlayerState.PLAYING:
                startProgressTracking();
                break;
              case window.YT.PlayerState.PAUSED:
              case window.YT.PlayerState.BUFFERING:
                stopProgressTracking();
                break;
              case window.YT.PlayerState.ENDED:
                console.log('Song ended → play next');
                stopProgressTracking();
                setTimeout(() => onNextRef.current(), 500);
                break;
            }
          },
          onError: (err: any) => {
            console.error('YouTube Player Error:', err);
          },
        },
      });
    }
  }, [isAPIReady, onPlayerReady]);

  // Load new song when currentSong changes
  useEffect(() => {
    if (isPlayerReady && currentSong?.id && playerRef.current) {
      console.log('Loading new song:', currentSong.title);
      playerRef.current.loadVideoById(currentSong.id);
      setCurrentTime(0);
      setDuration(currentSong.durationSeconds || 0);
      if (isPlaying) {
        setTimeout(() => playerRef.current.playVideo(), 300);
      }
    }
  }, [currentSong?.id, isPlayerReady]);

  // Sync play/pause with state
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
        startProgressTracking();
      } else {
        playerRef.current.pauseVideo();
        stopProgressTracking();
      }
    } catch (error) {
      console.error('Player play/pause error:', error);
    }
  }, [isPlaying, isPlayerReady]);

  // Track progress
  const startProgressTracking = () => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      try {
        const time = playerRef.current?.getCurrentTime?.();
        const dur = playerRef.current?.getDuration?.();
        if (typeof time === 'number') setCurrentTime(time);
        if (typeof dur === 'number' && dur > 0) setDuration(dur);
      } catch {}
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Seek when clicking on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !isPlayerReady) return;
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;
    const newTime = (clickX / bar.clientWidth) * duration;
    try {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    } catch (err) {
      console.error('Seek error:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Destroy player error:', error);
        }
      }
    };
  }, []);

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[hsl(var(--player-bg))] border-t border-border backdrop-blur-lg z-50 animate-slide-up">
      {/* Progress bar */}
      <div
        className="w-full h-1 bg-muted/50 cursor-pointer group"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-primary transition-all duration-200 group-hover:bg-primary/80"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className="w-14 h-14 rounded object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-foreground truncate text-sm">
                {currentSong.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
            {/* Time */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="text-foreground hover:text-primary"
              disabled={playlist.length <= 1}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={onPlayPause}
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-black"
              disabled={!isPlayerReady}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-black" />
              ) : (
                <Play className="h-5 w-5 fill-black ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="text-foreground hover:text-primary"
              disabled={playlist.length <= 1}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 hidden lg:block" />
        </div>
      </div>

      {/* Hidden YT player */}
      <div id="youtube-player" className="hidden" />
    </div>
  );
}
