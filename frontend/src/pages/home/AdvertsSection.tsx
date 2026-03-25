import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ModelType } from "../../enums/enums";
import { useScrollReveal } from "../../hooks/Helper";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { Advert } from "../../interfaces/interfaces";
import { AdvertService } from "../../services/advert.service";

// ─── YouTube IFrame API types (not in @types/youtube by default) ──
declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getPlayerState(): number;
  destroy(): void;
}

// ─── Load the YouTube IFrame API script once ─────────────────────
function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    // Already loaded
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    // Already injected but not ready yet
    if (document.getElementById("yt-api-script")) {
      const existing = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        existing?.();
        resolve();
      };
      return;
    }

    window.onYouTubeIframeAPIReady = resolve;
    const script = document.createElement("script");
    script.id = "yt-api-script";
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
}

// ─── Extract YouTube video ID from any embed or watch URL ────────
function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    // https://www.youtube.com/embed/VIDEO_ID
    if (u.pathname.startsWith("/embed/"))
      return u.pathname.split("/embed/")[1].split("?")[0];
    // https://www.youtube.com/watch?v=VIDEO_ID
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    // https://youtu.be/VIDEO_ID
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    return null;
  } catch {
    return null;
  }
}

// ─── YouTube Player hook ─────────────────────────────────────────
function useYouTubePlayer(
  containerRef: React.RefObject<HTMLDivElement>,
  videoId: string | null,
  onStateChange?: (state: number) => void,
) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !videoId) return;

    let destroyed = false;

    loadYouTubeAPI().then(() => {
      if (destroyed || !containerRef.current) return;

      // Destroy previous player on the same container before creating a new one
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0, // ← start paused
          mute: 0, // ← not muted — user controls this
          rel: 0, // no related videos at the end
          modestbranding: 1,
          controls: 1, // show YouTube native controls
          playsinline: 1,
        },
        events: {
          onReady: () => {
            setReady(true);
          },
          onStateChange: (e) => {
            onStateChange?.(e.data);
          },
        },
      });
    });

    return () => {
      destroyed = true;
      setReady(false);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
    // Intentionally not including onStateChange in deps to avoid re-creating player on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return { player: playerRef, ready };
}

// ─── Single video player card ─────────────────────────────────────
interface VideoPlayerProps {
  advert: Advert;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ advert, onEnded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const videoId = extractVideoId(advert.MediaUrl);

  const { player, ready } = useYouTubePlayer(
    containerRef as React.RefObject<HTMLDivElement>,
    videoId,
    useCallback(
      (state: number) => {
        if (!window.YT) return;
        setIsPlaying(state === window.YT.PlayerState.PLAYING);
        if (state === window.YT.PlayerState.PLAYING) setShowOverlay(false);
        if (state === window.YT.PlayerState.PAUSED) setShowOverlay(false);
        if (state === window.YT.PlayerState.ENDED) {
          setShowOverlay(true);
          onEnded?.();
        }
      },
      [onEnded],
    ),
  );

  const togglePlay = () => {
    if (!player.current || !ready) return;
    if (isPlaying) {
      player.current.pauseVideo();
    } else {
      player.current.playVideo();
      setShowOverlay(false);
    }
  };

  const toggleMute = () => {
    if (!player.current || !ready) return;
    if (isMuted) {
      player.current.unMute();
      setIsMuted(false);
    } else {
      player.current.mute();
      setIsMuted(true);
    }
  };

  // If the URL isn't a YouTube link, fall back to a plain iframe
  if (!videoId) {
    return (
      <div className="relative aspect-video">
        <iframe
          src={advert.MediaUrl}
          title={advert.Title ?? "Video"}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black">
      {/* YouTube player mounts here — the API replaces this div with an iframe */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Custom overlay — shown before the user presses play */}
      {showOverlay && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          style={{
            background: "rgba(8,15,40,0.72)",
            backdropFilter: "blur(2px)",
          }}
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/40 flex items-center justify-center hover:bg-white/25 hover:scale-110 transition-all duration-200">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
          {advert.Title && (
            <p className="text-white/80 text-sm font-semibold mt-4 px-6 text-center">
              {advert.Title}
            </p>
          )}
          <p className="text-white/40 text-xs mt-1">Click to play</p>
        </div>
      )}

      {/* Floating controls — visible once playing or paused (overlay dismissed) */}
      {!showOverlay && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all duration-150 backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all duration-150 backdrop-blur-sm"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const AdvertsSection: React.FC = () => {
 useSocketInvalidation(ModelType.Advert);

  const [current, setCurrent] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: [ModelType.Advert.toLowerCase()],
    queryFn: () => AdvertService.FetchActiveAdverts(),
  });

  const adverts = data?.DataList ?? [];
  useScrollReveal([adverts.length]);

  const prev = () =>
    setCurrent((c) => (c - 1 + adverts.length) % adverts.length);
  const next = () => setCurrent((c) => (c + 1) % adverts.length);

  if (isLoading) {
    return (
      <section className="section-padding" style={{ background: "#080f28" }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="skeleton h-8 w-32 rounded-full mx-auto mb-4 opacity-20" />
            <div className="skeleton h-10 w-64 rounded-xl mx-auto mb-3 opacity-20" />
            <div className="skeleton h-4 w-80 rounded-lg mx-auto opacity-20" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="skeleton rounded-3xl aspect-video opacity-10" />
          </div>
        </div>
      </section>
    );
  }

  if (adverts.length === 0) return null;

  const activeAdvert = adverts[current];

  return (
    <section className="section-padding" style={{ background: "#080f28" }}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="reveal inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 mb-4">
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-white/80 tracking-widest uppercase">
              Watch &amp; Learn
            </span>
          </div>
          <h2 className="reveal font-display text-4xl font-700 text-white mb-3">
            See Us in <span className="text-gradient-gold">Action</span>
          </h2>
          <p className="reveal stagger-2 text-white/50 max-w-lg mx-auto">
            Watch how we transform homes and businesses with professional
            technology installations.
          </p>
        </div>

        {/* Player */}
        <div className="reveal max-w-4xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-navy-900"
            style={{ boxShadow: "0 0 80px rgba(22,96,235,0.2)" }}
          >
            {/* key prop forces full unmount+remount when advert changes,
                destroying the old YT player and creating a fresh one */}
            <VideoPlayer
              key={activeAdvert.AdvertId}
              advert={activeAdvert}
              onEnded={adverts.length > 1 ? next : undefined}
            />

            {/* Title bar */}
            <div className="px-6 py-4 bg-navy-900/95 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">
                  {activeAdvert.Title ?? "Raz Technologies"}
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {current + 1} of {adverts.length}
                </p>
              </div>
              {/* Dot indicators */}
              {adverts.length > 1 && (
                <div className="flex gap-2">
                  {adverts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-6 h-2 bg-primary-500"
                          : "w-2 h-2 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Go to video ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prev / Next */}
          {adverts.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white hover:bg-white/15 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white hover:bg-white/15 transition-all duration-200"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdvertsSection;
