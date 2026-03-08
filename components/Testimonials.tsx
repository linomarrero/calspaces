"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "I stopped missing my gym sessions because it actually accounts for how long I take to get ready. Small thing. Big difference.",
    attribution: "Maya T., grad student",
  },
  {
    quote:
      "Every productivity app I've tried assumed I'd stick to the plan. CalSpaces assumes I won't.",
    attribution: "James R., freelance dev",
  },
  {
    quote:
      "The voice dump alone is worth it. I was spending 20 minutes every morning figuring out what to do first.",
    attribution: "Priya N., product manager",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-accent text-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-16">
          From people who&apos;ve tried it.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.attribution}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-display text-xl md:text-2xl italic text-white/95 leading-snug">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 font-mono text-xs text-white/60">
                — {t.attribution}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
