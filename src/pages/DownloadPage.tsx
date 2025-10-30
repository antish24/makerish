"use client";

import { useState, useRef, useEffect } from "react";
import {
  DownloadIcon,
  PlayIcon,
  PauseIcon,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AudioFile {
  id: string;
  name: string;
  filename: string;
  duration: string;
  durationSeconds: number;
}

const audioFiles: AudioFile[] = [
  {
    id: "1",
    name: "Fart Sound",
    filename: "fart.mp3",
    duration: "0:17",
    durationSeconds: 17,
  },
  {
    id: "2",
    name: "Abiy Song",
    filename: "abiy.mp3",
    duration: "0:10",
    durationSeconds: 10,
  },
  {
    id: "3",
    name: "Scream Effect",
    filename: "a.mp3",
    duration: "0:07",
    durationSeconds: 7,
  },
  {
    id: "4",
    name: "Cow",
    filename: "cow.mp3",
    duration: "0:02",
    durationSeconds: 2,
  },
  {
    id: "5",
    name: "Goat",
    filename: "goat.mp3",
    duration: "0:01",
    durationSeconds: 1,
  },
  {
    id: "6",
    name: "Toy Phone",
    filename: "toy.mp3",
    duration: "0:15",
    durationSeconds: 15,
  },
];

const DownloadPage = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const selectedTrack = audioFiles.find((f) => f.id === selectedFile);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Handle audio selection and changes
  const handleSelectFile = (fileId: string) => {
    // Stop current playback and cleanup
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setSelectedFile(fileId);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Initialize audio when selected file changes
  useEffect(() => {
    if (!selectedFile) return;

    const file = audioFiles.find((f) => f.id === selectedFile);
    if (!file) return;

    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create new audio instance
    audioRef.current = new Audio(`/${file.filename}`);
    const audio = audioRef.current;

    audio.loop = true; // Enable looping

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      // Audio will automatically loop due to loop property
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Play automatically if was playing before
    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }

    // Cleanup function
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [selectedFile]); // Re-initialize when selectedFile changes

  const togglePlayPause = () => {
    if (!selectedFile || !audioRef.current) {
      alert("Please select a file to play.");
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          alert("Playback failed.");
          setIsPlaying(false);
        });
    }
  };

  const handlePlay = (fileId: string) => {
    if (selectedFile === fileId) {
      togglePlayPause();
    } else {
      handleSelectFile(fileId);
      // Small delay to ensure audio is loaded before playing
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              alert("Playback failed.");
            });
        }
      }, 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !selectedTrack) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const seekTime =
      (clickPosition / progressBar.clientWidth) * selectedTrack.durationSeconds;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const downloadSelected = async () => {
    if (!selectedFile) {
      alert("Please select a file to download.");
      return;
    }

    setIsDownloading(true);
    try {
      const file = audioFiles.find((f) => f.id === selectedFile);
      if (file) {
        const response = await fetch(`/${file.filename}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      alert(`${selectedTrack?.name} downloaded successfully`);
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent =
    selectedTrack && selectedTrack.durationSeconds > 0
      ? (currentTime / selectedTrack.durationSeconds) * 100
      : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-2 flex items-center justify-between gap-2">
          <div  onClick={() => navigate("/")} className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              <span className="bg-gradient-to-r from-primary/50 to-primary/90 bg-clip-text text-transparent">
                Madify
              </span>
            </h1>
            <p className="text-xs text-muted-foreground -mt-1 font-medium">
              Download & Preview
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Audio Files List */}
        <div className="space-y-2">
          {audioFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => handlePlay(file.id)}
            >
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-black/40 rounded-lg flex items-center justify-center">
                    <PlayIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                  {selectedFile === file.id && isPlaying && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                      <div className="flex gap-1">
                        <div
                          className="w-1 h-4 bg-primary animate-pulse"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-1 h-4 bg-primary animate-pulse"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-1 h-4 bg-primary animate-pulse"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <p className="truncate">{file.filename}</p>
                    <span className="text-xs opacity-70">•</span>
                    <span className="text-xs opacity-80 flex-shrink-0">
                      {file.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Player Bar */}
      {selectedTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border backdrop-blur-lg z-50">
          {/* Progress Bar */}
          <div
            className="w-full h-1.5 bg-muted/50 cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div
                        className="w-1 h-4 bg-primary animate-pulse"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-1 h-4 bg-primary animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-1 h-4 bg-primary animate-pulse"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  ) : (
                    <PlayIcon className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-foreground truncate text-sm">
                    {selectedTrack.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedTrack.filename}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground flex-shrink-0">
                  {formatTime(currentTime)} / {selectedTrack.duration}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="p-3 border border-border rounded-lg bg-background hover:bg-accent disabled:opacity-50 transition-colors"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-5 w-5 text-foreground" />
                  ) : (
                    <PlayIcon className="h-5 w-5 text-foreground" />
                  )}
                </button>

                <button
                  className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  onClick={downloadSelected}
                  disabled={isDownloading}
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
