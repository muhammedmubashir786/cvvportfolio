"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import type { Certification } from "@/types";

function formatYear(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).getFullYear().toString();
}

export function Certifications({
  certifications,
}: {
  certifications: Certification[];
}) {
  return (
    <section id="certifications" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow="Certifications" title="Credentials" />

        {certifications.length === 0 ? (
          <p className="text-ink-muted">
            No certifications added yet — add some in the admin dashboard.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10">
                    <Award className="h-5 w-5 gold-text" aria-hidden="true" />
                  </div>
                  {cert.issue_date && (
                    <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                      {formatYear(cert.issue_date)}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {cert.organization}
                </p>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs gold-text hover:underline"
                  >
                    View credential
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
