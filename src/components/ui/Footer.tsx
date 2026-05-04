"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { navLinks } from "@/data/navigation";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

const Footer = () => (
  <footer className="relative pt-24 pb-10 bg-bg overflow-hidden" aria-label="Site footer">
    {/* Top border */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" aria-hidden="true" />

    <div className="max-w-7xl mx-auto px-6">
      {/* Big tagline */}
      <div className="mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[clamp(4rem,10vw,7rem)] font-black tracking-tighter select-none cursor-default gradient-text opacity-20 hover:opacity-70 transition-opacity duration-[700ms]"
        >
          BUILT WITH INTENTION.
        </motion.p>
      </div>

      {/* Nav links */}
      <nav aria-label="Footer navigation">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12" role="list">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-sm font-mono text-text-faint hover:text-accent-cyan transition-colors duration-[250ms]"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom row */}
      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-text-faint">
          &copy; {new Date().getFullYear()} Amine Nahli.{" "}
          <span className="text-success/70 ml-1">&#x25cf; All systems operational.</span>
        </p>

        {/* Social links */}
        <div className="flex items-center gap-4" aria-label="Social links">
          <a href="https://linkedin.com/in/amine-nahli-48b2a734b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-text-faint hover:text-accent-cyan transition-colors duration-[250ms]">
            <LinkedinIcon size={17} />
          </a>
          <a href="https://github.com/Amine-NAHLI" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-text-faint hover:text-accent-cyan transition-colors duration-[250ms]">
            <GithubIcon size={17} />
          </a>
          <a href="mailto:nahli-ami@upf.ac.ma" aria-label="Email" className="text-text-faint hover:text-accent-cyan transition-colors duration-[250ms]">
            <Mail size={17} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Terminal easter egg */}
      <div className="mt-10 flex justify-center">
        <TerminalEgg />
      </div>
    </div>
  </footer>
);

const PHRASE = "session paused · ready when you are";

const TerminalEgg = () => {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    let i = 0;
    let forward = true;
    let t: NodeJS.Timeout;

    const tick = () => {
      if (forward) {
        i++;
        setText(PHRASE.slice(0, i));
        if (i >= PHRASE.length) {
          t = setTimeout(() => { forward = false; tick(); }, 3000);
          return;
        }
      } else {
        i--;
        setText(PHRASE.slice(0, i));
        if (i <= 0) forward = true;
      }
      t = setTimeout(tick, forward ? 75 : 35);
    };

    tick();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="font-mono text-[10px] text-text-faint/25 uppercase tracking-[0.3em] flex items-center gap-1" aria-hidden="true">
      <span>{text}</span>
      <span className="cursor-blink w-1 h-3 bg-accent-cyan/25 inline-block" />
    </div>
  );
};

export default Footer;
