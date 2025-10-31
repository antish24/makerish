import { Play, Plus, Check } from 'lucide-react';
import { Song } from '@/lib/youtube';

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  onPlay: () => void;
  onToggleSelect?: (song: Song) => void;
  isSelected?: boolean;
}

export function SongCard({ song, isPlaying, onPlay, onToggleSelect, isSelected }: SongCardProps) {
  return (
    <div className="relative group cursor-pointer" onClick={onPlay}>
      <div className="flex items-center gap-3">
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
                <div className="w-1 h-4 bg-primary animate-pulse" />
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-10"> {/* Added pr-10 for right padding */}
          <h3 className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {song.title}
          </h3>
          <div className="flex items-center gap-2 text-xs opacity-80 text-muted-foreground">
            <p className="truncate">{song.artist}</p>
            <span className="opacity-70">•</span>
            <span className="flex-shrink-0">
              {song.duration || '0:00'}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Add button (top-right corner, does NOT affect layout) */}
      {onToggleSelect && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering play
            onToggleSelect(song);
          }}
          className={`absolute top-1/3 -right-1 p-1 rounded-full border transition-colors ${
            isSelected ? 'bg-primary text-black border-primary' : 'hover:bg-muted border-border text-foreground'
          }`}
          title={isSelected ? 'Remove from playlist' : 'Add to playlist'}
        >
          {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}