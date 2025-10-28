import { Play } from 'lucide-react';
import { Song } from '@/lib/youtube';

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  onPlay: () => void;
}

export function SongCard({ song, isPlaying, onPlay }: SongCardProps) {
  return (
    <div
      onClick={onPlay}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-16 h-16 rounded object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
            <Play className="h-6 w-6 text-primary fill-primary" />
          </div>
          {isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {song.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <p className="truncate">{song.artist}</p>
            <span className="text-xs opacity-70">•</span>
            <span className="text-xs opacity-80 flex-shrink-0">
              {song.duration || '0:00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}