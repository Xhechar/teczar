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
    onYouTubeIframeAPIReady?: () => void;
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

// ─── Load YouTube IFrame API script exactly once ──────────────────
function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    if (!document.getElementById("yt-api-script")) {
      const s = document.createElement("script");
      s.id = "yt-api-script";
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
}

// ─── Extract video ID from any YouTube URL format ─────────────────
function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/embed/"))
      return u.pathname.split("/embed/")[1].split("?")[0];
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
  } catch {}
  return null;
}

function ytThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

interface VideoPlayerProps {
  advert: Advert;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ advert, onEnded }) => {
  const videoId = extractVideoId(advert.MediaUrl);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  // hasStarted = user has clicked play at least once → show the iframe
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // Build the player only after the user clicks play
  useEffect(() => {
    if (!hasStarted || !videoId || !containerRef.current) return;

    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1, // user already clicked — start playing
          mute: 0,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          playsinline: 1,
        },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return;
            setPlayerReady(true);
            target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: ({ data }) => {
            if (!window.YT || cancelled) return;
            setIsPlaying(data === window.YT.PlayerState.PLAYING);
            if (data === window.YT.PlayerState.ENDED) onEnded?.();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
        setPlayerReady(false);
        setIsPlaying(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, videoId]);

  const handleFirstPlay = () => {
    if (!videoId) return;
    setHasStarted(true); // mounts the container → triggers useEffect above
  };

  const togglePlay = () => {
    if (!playerRef.current || !playerReady) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current || !playerReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  // Non-YouTube URL → plain iframe fallback
  if (!videoId) {
    return (
      <div className="relative aspect-video">
        <iframe
          src={advert.MediaUrl}
          title={advert.Title ?? "Video"}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black">
      {/* ── BEFORE FIRST CLICK: static thumbnail + play overlay ── */}
      {!hasStarted && (
        <>
          {/* YouTube thumbnail */}
          <img
            src={ytThumbnail(videoId)}
            alt={advert.Title ?? "Video thumbnail"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(8,15,40,0.55)" }}
          />

          {/* Play button */}
          <button
            onClick={handleFirstPlay}
            aria-label="Play video"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-200">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
            {advert.Title && (
              <p className="text-white font-semibold text-sm px-6 text-center drop-shadow">
                {advert.Title}
              </p>
            )}
            <p className="text-white/60 text-xs">Click to play</p>
          </button>
        </>
      )}

      {/* ── AFTER FIRST CLICK: YouTube player mounts here ── */}
      {hasStarted && (
        <>
          {/* This div is replaced by the YT iframe via the API */}
          <div ref={containerRef} className="w-full h-full" />

          {/* Floating controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition-all"
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
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Section ──────────────────────────────────────────────────────
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
            {/*
              key={activeAdvert.AdvertId} forces VideoPlayer to fully unmount
              when switching adverts, destroying the old YT player and resetting
              hasStarted back to false (thumbnail shown again for new video).
            */}
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
              {adverts.length > 1 && (
                <div className="flex gap-2">
                  {adverts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-primary-500" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
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