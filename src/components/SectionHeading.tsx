"use client";

import { motion } from "framer-motion";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-12 ${align === "center" ? "text-center" : ""}`}
    >
      <span className="font-mono text-xs tracking-[0.25em] uppercase gold-text">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-ink">
        {title}
      </h2>
      <div
        className={`mt-4 h-px w-16 bg-gold ${align === "center" ? "mx-auto" : ""}`}
      />
    </motion.div>
  );
}
