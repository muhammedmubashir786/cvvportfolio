"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import type { TimelineEntry } from "@/types";

function formatRange(start: string | null, end: string | null) {
  const startYear = start ? new Date(start).getFullYear() : "?";
  const endYear = end ? new Date(end).getFullYear().toString() : "Present";
  return `${startYear} — ${endYear}`;
}

export function Experience({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <section id="experience" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow="Journey" title="How I got here" />

        {timeline.length === 0 ? (
          <p className="text-ink-muted">
            No experience or education added yet — add some in the admin
            dashboard.
          </p>
        ) : (
          <div className="relative">
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-gold/20 md:left-1/2 md:-translate-x-1/2"
              aria-hidden="true"
            />

            <ol className="space-y-10">
              {timeline.map((entry, i) => {
                const leftSide = i % 2 === 0;
                return (
                  <motion.li
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className={`relative pl-8 md:w-1/2 md:pl-0 ${
                      leftSide
                        ? "md:pr-12 md:text-right"
                        : "md:ml-auto md:pl-12"
                    }`}
                  >
                    <span
                      className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-gold bg-bg left-0 ${
                        leftSide ? "md:left-auto md:-right-2" : "md:-left-2"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="glass inline-block w-full rounded-2xl p-5 text-left">
                      <span className="font-mono text-xs gold-text">
                        {formatRange(entry.start_date, entry.end_date)}
                        {entry.kind === "education" ? " · Education" : ""}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                        {entry.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-ink-muted">
                        {entry.subtitle}
                      </p>
                      {entry.description && (
                        <p className="mt-2 text-sm text-ink-muted">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
