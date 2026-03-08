"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Demo" },
  { href: "#waitlist", label: "Waitlist" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-linen/80 backdrop-blur-md border-b border-warm-gray/60" : "bg-transparent"
      }`}
    >
      <nav className="w-full">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center">
            <img
              src="/calspaceslogofull.svg"
              alt="CalSpaces"
              style={{ height: "32px", width: "auto" }}
            />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="#waitlist"
              className="inline-block bg-accent text-white font-body text-sm font-medium px-5 py-2.5 rounded-sharp hover:opacity-90 transition-opacity"
            >
              Get Early Access
            </Link>
          </div>

          <button
            type="button"
            aria-label="Menu"
            className="md:hidden p-2 text-near-black"
            onClick={() => setOpen(true)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-linen z-50 flex flex-col justify-center items-center gap-8 md:hidden"
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute top-5 right-5 p-2 text-near-black"
              onClick={() => setOpen(false)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-display text-2xl text-near-black"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="#waitlist"
              className="bg-accent text-white font-body font-medium px-6 py-3 rounded-sharp"
              onClick={() => setOpen(false)}
            >
              Get Early Access
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
