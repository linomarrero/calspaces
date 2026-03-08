"use client";

import { motion } from "framer-motion";

const features = [
  {
    name: "Voice input",
    description: "Speak naturally. No forms, no dropdowns. Just talk.",
  },
  {
    name: "Non-negotiables",
    description: "Set your fixed commitments once. CalSpaces never moves them.",
  },
  {
    name: "Urgency detection",
    description: "Deadlines and priority signals are parsed automatically from what you say.",
  },
  {
    name: "Completion tracking",
    description: "Mark done, mark partial, mark skipped. Your honesty makes it smarter.",
  },
  {
    name: "Time learning",
    description: "It notices that your 'quick emails' take 40 minutes. And adjusts.",
  },
  {
    name: "Google Calendar & Apple Calendar",
    description: "Native integration with Google Calendar and Apple Calendar. Your scheduled blocks sync both ways — no new app to live in.",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28 bg-linen">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-near-black">
          Everything it does, nothing it doesn&apos;t.
        </h2>

        <div className="mt-16">
          {features.map((f, i) => (
            <motion.div
              key={f.name}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-foreground/10 last:border-0 group"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="md:col-span-5 lg:col-span-4">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-near-black group-hover:bg-accent/10 -mx-2 px-2 py-1 rounded-sm transition-colors">
                  {f.name}
                </h3>
              </div>
              <div className="md:col-span-7 lg:col-span-8">
                <p className="font-body text-foreground/80 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
