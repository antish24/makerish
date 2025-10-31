"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GripVertical } from "lucide-react";
import { Song } from "@/lib/youtube";
import { useEffect, useRef, useState } from "react";

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSongs: Song[];
  onRemoveSong: (song: Song) => void;
  onRemoveAllSongs?: () => void;
  onPlaySong: (song: Song, index: number) => void;
  onReorderSongs: (songs: Song[]) => void;
  currentSongId?: string;
}

function DraggablePlaylistRow({
  song,
  index,
  isPlaying,
  onPlaySong,
  onRemoveSong,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: {
  song: Song;
  index: number;
  isPlaying: boolean;
  onPlaySong: (song: Song, index: number) => void;
  onRemoveSong: (song: Song) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    onDragStart(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOver(index);
  };

  return (
    <div
      className={`
        flex items-center gap-3 py-2 px-1 bg-card rounded-lg border border-border 
        transition-all duration-200 cursor-pointer
        ${isDragging ? "opacity-50 scale-[0.98] bg-muted/50" : "opacity-100"}
      `}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={onDragEnd}
    >
      {/* Drag handle */}
      <div
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
        draggable
        onMouseDown={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Song content */}
      <div
        className="flex items-center gap-2 flex-1 min-w-0"
        onClick={() => onPlaySong(song, index)}
      >
        <div className="relative flex-shrink-0">
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
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

        <div className="flex-1 min-w-0">
          <p className="text-xs truncate text-foreground">{song.title}</p>
          <div className="flex items-center gap-2 text-xs opacity-80 text-muted-foreground">
            <p className="truncate">{song.artist}</p>
            <span>•</span>
            <span className="flex-shrink-0">{song.duration || "0:00"}</span>
          </div>
        </div>
      </div>

      <button
        className="text-red-500 hover:text-red-600 font-bold text-lg flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500/10 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveSong(song);
        }}
      >
        &minus;
      </button>
    </div>
  );
}

export function PlaylistDrawer({
  isOpen,
  onClose,
  selectedSongs,
  onRemoveSong,
  onRemoveAllSongs,
  onPlaySong,
  onReorderSongs,
  currentSongId,
}: PlaylistDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [localSongs, setLocalSongs] = useState<Song[]>(selectedSongs);

  useEffect(() => {
    setLocalSongs(selectedSongs);
  }, [selectedSongs]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newSongs = [...localSongs];
    const [draggedItem] = newSongs.splice(draggedIndex, 1);
    newSongs.splice(targetIndex, 0, draggedItem);

    setLocalSongs(newSongs);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      onReorderSongs(localSongs);
    }
    setDraggedIndex(null);
  };

  useEffect(() => {
    if (!containerRef.current || !isOpen) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl flex flex-col overflow-hidden max-w-3xl mx-auto"
            style={{
              height: "calc(90vh - 96px)",
              marginBottom: "96px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-4 flex justify-between items-center border-b border-border z-20">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Playlist ({localSongs.length})
                </h2>
              </div>
              <div className="flex gap-3">
                {localSongs.length > 0 && onRemoveAllSongs && (
                  <button
                    className="text-red-500 hover:text-red-600 font-medium text-sm px-3 py-1 rounded-md hover:bg-red-500/10 transition-colors"
                    onClick={() => {
                      if (confirm("Remove all songs from the playlist?")) {
                        onRemoveAllSongs();
                      }
                    }}
                  >
                    Remove All
                  </button>
                )}
                <button
                  className="text-foreground hover:text-red-500 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  onClick={onClose}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Playlist Content */}
            <div ref={containerRef} className="flex-1 overflow-y-auto p-2">
              {localSongs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4 text-4xl">🎵</div>
                  <p className="text-muted-foreground text-sm">
                    No songs in the playlist
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-1">
                    Add songs from search to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {localSongs.map((song, index) => (
                    <DraggablePlaylistRow
                      key={`${song.id}-${index}`}
                      song={song}
                      index={index}
                      isPlaying={song.id === currentSongId}
                      onPlaySong={onPlaySong}
                      onRemoveSong={onRemoveSong}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedIndex === index}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
