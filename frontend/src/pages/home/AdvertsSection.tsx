import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Play, Loader2 } from "lucide-react";
import { ModelType } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { AdvertService } from "../../services/advert.service";

const AdvertsSection: React.FC = () => {
  useSocketInvalidation(ModelType.Advert);

  const [current, setCurrent] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: [ModelType.Advert.toLowerCase()],
    queryFn: () => AdvertService.FetchActiveAdverts()
  });

  const adverts = data?.DataList ?? [];

  const prev = () =>
    setCurrent((c) => (c - 1 + adverts.length) % adverts.length);
  const next = () => setCurrent((c) => (c + 1) % adverts.length);

  if (isLoading) {
    return (
      <section className="section-padding bg-navy-950">
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
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

        {/* Video player */}
        <div className="reveal max-w-4xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-navy-900"
            style={{ boxShadow: "0 0 80px rgba(22,96,235,0.2)" }}
          >
            {/* Video */}
            <div className="relative aspect-video">
              <iframe
                key={activeAdvert.AdvertId}
                src={activeAdvert.MediaUrl}
                title={activeAdvert.Title ?? "Raz Technologies Video"}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Title bar */}
            {activeAdvert.Title && (
              <div className="px-6 py-4 bg-navy-900/95 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {activeAdvert.Title}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {current + 1} of {adverts.length}
                  </p>
                </div>

                {/* Dot indicators */}
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
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          {adverts.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white hover:bg-white/15 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white hover:bg-white/15 transition-all duration-200"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdvertsSection;