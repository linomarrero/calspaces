import Link from "next/link";

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Demo" },
  { href: "#waitlist", label: "Waitlist" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const socials = [
  { href: "https://twitter.com", label: "Twitter/X" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-near-black text-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-display text-white"
            >
              CalSpaces
            </Link>
            <p className="mt-2 font-body text-sm text-white/70">
              Built for the way you actually live.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
              Social
            </p>
            <ul className="space-y-2">
              {socials.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="font-mono text-[10px] text-white/50">
            © 2025 CalSpaces. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
