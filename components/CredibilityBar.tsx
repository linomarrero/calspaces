"use client";

import { motion } from "framer-motion";

const items = [
  { value: "100+", label: "early signups" },
  { value: "3.1 hrs", label: "reclaimed weekly (avg)" },
  { value: "Google Calendar", label: "native sync" },
  { value: "< 10 sec", label: "voice input" },
];

export default function CredibilityBar() {
  return (
    <section className="border-y border-warm-gray/80 bg-surface/50 py-5">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <div className="font-mono text-sm font-medium text-accent">{item.value}</div>
              <div className="font-body text-sm text-foreground/70 mt-0.5">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
