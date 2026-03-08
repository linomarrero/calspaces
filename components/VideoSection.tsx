"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-accent text-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <motion.p
              className="font-mono text-xs uppercase tracking-widest text-white/60 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Two minutes
            </motion.p>
            <motion.h2
              className="font-display text-3xl md:text-4xl font-semibold leading-tight"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              That&apos;s how long it takes to understand why CalSpaces is different.
            </motion.h2>
            <motion.p
              className="mt-4 font-body text-white/80 text-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              No pitch deck. No feature list. Just the product.
            </motion.p>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              className="relative aspect-video bg-near-black/40 rounded-sharp overflow-hidden"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {/* Placeholder until real video: solid + wordmark. Swap for iframe when ready. */}
              <div className="absolute inset-0 flex items-center justify-center bg-deep-forest/80">
                <span className="font-display text-4xl md:text-5xl font-semibold text-white/20 tracking-display">
                  CalSpaces
                </span>
              </div>
              {/* Optional: uncomment and add video URL when available
              {playing ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/VIDEO_ID?autoplay=1`}
                  title="CalSpaces demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
              */}
              {!playing && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Play video"
                >
                  <span className="w-16 h-16 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors border border-white/20">
                    <span className="w-0 h-0 border-l-[14px] border-l-white border-y-[10px] border-y-transparent ml-1" />
                  </span>
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
