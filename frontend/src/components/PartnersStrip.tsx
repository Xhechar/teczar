import React from "react";

const PARTNERS: { name: string; src: string }[] = [
  {
    name: "EPRA",
    src: "https://res.cloudinary.com/dakyiye2e/image/upload/v1778098862/el1djo5trjrb5fozgxvh.png",
  },
  {
    name: "Day Liff",
    src: "https://res.cloudinary.com/dakyiye2e/image/upload/v1778099133/n0i6bsybmcy8kvsqk5vl.png",
  },
  {
    name: "CTC",
    src: "https://res.cloudinary.com/dakyiye2e/image/upload/v1778099223/aebqkuojo3fnynt3e1wz.png",
  },
  {
    name: "Digisol",
    src: "https://res.cloudinary.com/dakyiye2e/image/upload/v1778099299/llo419ftolotcuuz6im5.png",
  },
  {
    name: "NCA",
    src: "https://res.cloudinary.com/dakyiye2e/image/upload/v1778099350/dgfnukgc8jgawkadsah4.png",
  },
  {
    name: "SRNE",
    src: "https://res.cloudinary.com/dakyiye2e/image/upload/v1778099412/b3dwj1myfgguj4b9wll1.png",
  },
  {
    name: "Scanfield",
    src: "https://res.cloudinary.com/dakyiye2e/image/upload/v1778099483/znkh5ubficcn0inofa4a.png",
  },
  {
    name: "Dahua",
    src: "https://res.cloudinary.com/dakyiye2e/image/upload/v1778099555/bldpr3bksngkqa1agpsg.png",
  },
];

// ─── Single logo pill ─────────────────────────────────────────────
const LogoPill: React.FC<{ partner: { name: string; src: string } }> = ({
  partner,
}) => (
  <div
    className="flex-shrink-0 flex items-center justify-center mx-6 px-8 py-4
               bg-white rounded-2xl border border-slate-100 shadow-sm
               hover:shadow-md hover:border-primary-100
               transition-all duration-300 group"
    style={{ minWidth: "160px" }}
  >
    <img
      src={partner.src}
      alt={partner.name}
      loading="lazy"
      className="h-10 w-auto max-w-[120px] object-contain
                 filter grayscale opacity-60
                 group-hover:grayscale-0 group-hover:opacity-100
                 transition-all duration-300"
    />
  </div>
);

// ─── Partners Strip ───────────────────────────────────────────────
const PartnersStrip: React.FC = () => {
  return (
    <section className="bg-surface-50 py-12 border-y border-slate-100 overflow-hidden">
      <div className="container-custom mb-8 text-center">
        <p className="text-xs font-700 text-slate-400 uppercase tracking-[0.2em]">
          Trusted by industry-leading brands
        </p>
      </div>

      {/*
        Marquee wrapper — overflow:hidden clips the track.
        Two identical sets inside a flex row that is 200% wide.
        CSS animation slides left by 50% (= one full set) then loops.
        The strip always scrolls regardless of screen width because
        the track is always wider than the viewport.

        Pauses on hover so users can read / interact.
      */}
      <div
        className="relative"
        style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
        /* Fade edges so logos appear to emerge from and disappear into mist */
      >
        <div
          className="flex"
          style={{
            animation: "marquee 28s linear infinite",
            willChange: "transform",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")
          }
        >
          {/* Set 1 */}
          {PARTNERS.map((p) => (
            <LogoPill key={`a-${p.name}`} partner={p} />
          ))}
          {/* Set 2 — identical duplicate for seamless loop */}
          {PARTNERS.map((p) => (
            <LogoPill key={`b-${p.name}`} partner={p} />
          ))}
        </div>
      </div>

      {/* Inject the keyframe once — avoids adding it to global CSS */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default PartnersStrip;