"use client";

import { motion, type Variants } from "framer-motion";
import { Mail, Download, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import Image from "next/image";
import type { Profile } from "@/types";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero({ profile }: { profile: Profile | null }) {
  // Fallbacks let the page render sensibly even before you've filled in
  // every field in the admin dashboard — nothing crashes on a null value.
  const name = profile?.name ?? "Your Name";
  const heroText =
    profile?.hero_text ??
    "Add a hero tagline in the admin dashboard to introduce yourself here.";
  const location = profile?.location ?? "";
  const resumeUrl = profile?.resume_url ?? "#";
  const photoUrl = profile?.photo_url ?? "/images/profile.jpg";
  const email = profile?.email;
  const githubUrl = profile?.github_url;
  const linkedinUrl = profile?.linkedin_url;

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20"
    >
      {/* Ambient gold glow */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gold)" }}
        aria-hidden="true"
      />

      <div className="section-container relative grid items-center gap-14 md:grid-cols-[1.2fr_0.8fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] gold-text"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Available for SOC &amp; Full-Stack roles
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-6xl"
          >
            {name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-lg text-ink-muted"
          >
            {heroText}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-medium text-bg transition-transform hover:scale-[1.03]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-ink transition-colors hover:border-gold"
            >
              Contact Me
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex items-center gap-4">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:border-gold hover:text-gold"
              >
                <GithubIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:border-gold hover:text-gold"
              >
                <LinkedinIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                aria-label="Send an email"
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:border-gold hover:text-gold"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <div className="glass absolute inset-0 rounded-[2rem]" />
          <div className="absolute inset-4 overflow-hidden rounded-[1.5rem] border border-gold/30">
            <Image
              src={photoUrl}
              alt={`Portrait of ${name}`}
              fill
              sizes="(max-width: 768px) 60vw, 24rem"
              className="object-cover"
              priority
            />
            {/* Scan-line sweep — nods to SOC monitoring */}
            <motion.div
              className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-gold/20 to-transparent"
              initial={{ y: "-120%" }}
              animate={{ y: "220%" }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
              aria-hidden="true"
            />
          </div>
          {location && (
            <div className="glass absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest gold-text">
              {location}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
