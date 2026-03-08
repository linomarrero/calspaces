"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Brain dump",
    body: "Open the app, hit record, and say everything. Deadlines, errands, anxieties, goals. All of it. Don't organize — that's not your job.",
  },
  {
    num: "02",
    title: "We build your schedule",
    body: "CalSpaces maps everything against your non-negotiables: classes, sleep, standing commitments. Tasks land where they actually fit.",
  },
  {
    num: "03",
    title: "You live your day",
    body: "Check things off as you go. If something runs long or you skip it, log it. Takes 3 seconds.",
  },
  {
    num: "04",
    title: "It gets smarter",
    body: "Your real patterns feed back into the model. Over time, CalSpaces stops scheduling 4 hours of work into 2-hour windows.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-2">
          How it works
        </p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-near-black mb-16">
          Four steps. No spreadsheets.
        </h2>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 border-b border-foreground/10 last:border-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="md:col-span-2">
                <span className="font-mono text-4xl md:text-5xl font-light text-foreground/25">
                  {step.num}
                </span>
              </div>
              <div className="md:col-span-10">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-near-black mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-foreground/80 leading-relaxed max-w-xl">
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
